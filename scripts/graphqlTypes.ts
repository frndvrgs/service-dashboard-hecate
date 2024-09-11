import fs from "fs/promises";
import {
  IntrospectionQuery,
  IntrospectionType,
  IntrospectionInputValue,
  IntrospectionField,
  IntrospectionEnumType,
} from "graphql";
import dotenv from "dotenv";

dotenv.config();

// this script generates a typescript global declaration file based on the graphql introspection
// by default, you can use the types directly from the global namespace API > [api_version] > [type_name]
// and it must be generated periodically. the settings can be set on the .env file.

// be aware that any changes to the types file that remove or alter typings may break the application until everything is adjusted.
//
// example:
//
// const response = await graphqlClient.request<API.GraphQL.v1.Query['listAccounts']>(
//   LIST_ACCOUNTS,
// );

const GRAPHQL_INTROSPECTION_URL =
  process.env.GRAPHQL_INTROSPECTION_URL || "http://127.0.0.1:20110/graphql";
const GRAPHQL_INTROSPECTION_MAX_DEPTH = parseInt(
  process.env.GRAPHQL_INTROSPECTION_MAX_DEPTH || "7",
  10,
);
const GRAPHQL_INTROSPECTION_VERSION =
  process.env.GRAPHQL_INTROSPECTION_VERSION || "v1";
const GRAPHQL_TYPES_NAMESPACE = "API";
const GRAPHQL_TYPES_FILE_OUTPUT =
  process.env.GRAPHQL_TYPES_FILE_OUTPUT || "src/types";

// the introspection query is not always able to deeply check the nesting of types, resulting in missing types,
// if this occurs, increase the level of MAX_DEPTH and test the output

const generateTypeRefFragment = (depth: number): string => {
  let fragment = `
    fragment TypeRef on __Type {
      kind
      name
    `;

  let currentDepth = depth;
  let indent = "  ";
  while (currentDepth > 0) {
    fragment += `${indent}ofType {\n`;
    indent += "  ";
    fragment += `${indent}kind\n`;
    fragment += `${indent}name\n`;
    currentDepth--;
  }

  while (indent.length > 2) {
    indent = indent.slice(2);
    fragment += `${indent}}\n`;
  }

  fragment += `}`;

  return fragment;
};

const introspectionQuery = `
  query IntrospectionQuery {
    __schema {
      types {
        kind
        name
        description
        fields(includeDeprecated: true) {
          name
          description
          args {
            name
            description
            type {
              ...TypeRef
            }
            defaultValue
          }
          type {
            ...TypeRef
          }
          isDeprecated
          deprecationReason
        }
        inputFields {
          name
          description
          type {
            ...TypeRef
          }
          defaultValue
        }
        interfaces {
          ...TypeRef
        }
        enumValues(includeDeprecated: true) {
          name
          description
          isDeprecated
          deprecationReason
        }
        possibleTypes {
          ...TypeRef
        }
      }
    }
  }
  
  ${generateTypeRefFragment(GRAPHQL_INTROSPECTION_MAX_DEPTH)}
  `;

const FILE_HEADER =
  "\n// THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)\n\n";

const mapGraphQLTypeToTypeScript = (type: string): string => {
  switch (type) {
    case "ID":
    case "String":
      return "string";
    case "Int":
    case "Float":
      return "number";
    case "Boolean":
      return "boolean";
    case "DateTime":
      return "string";
    case "JSONObject":
      return "Record<string, any>";
    default:
      return type;
  }
};

const getFieldType = (
  type: any,
  enumNames: Set<string>,
): { typeName: string; isOptional: boolean; isEnum: boolean } => {
  if (!type) {
    console.warn("undefined type encountered in getFieldType");
    return { typeName: "any", isOptional: true, isEnum: false };
  }

  switch (type.kind) {
    case "NON_NULL":
      const innerType = getFieldType(type.ofType, enumNames);
      return { ...innerType, isOptional: false };
    case "LIST":
      const listType = getFieldType(type.ofType, enumNames);
      return {
        typeName: `${listType.typeName}[]`,
        isOptional: true,
        isEnum: false,
      };
    case "SCALAR":
    case "OBJECT":
    case "ENUM":
    case "INPUT_OBJECT":
    case "UNION":
    case "INTERFACE":
      const mappedType = mapGraphQLTypeToTypeScript(type.name);
      return {
        typeName: mappedType,
        isOptional: true,
        isEnum: enumNames.has(type.name),
      };
    default:
      console.warn(`unknown type kind: ${type.kind}`);
      return { typeName: "any", isOptional: true, isEnum: false };
  }
};

const generateGraphQLTypes = async (): Promise<void> => {
  try {
    console.info(
      `:: introspecting GraphQL endpoint: ${GRAPHQL_INTROSPECTION_URL}`,
    );
    const response = await fetch(GRAPHQL_INTROSPECTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    if (!response.ok) {
      return console.error(
        ":: error fetching graphql url:",
        response.status,
        response.statusText,
      );
    }

    const { data }: { data: IntrospectionQuery } = await response.json();

    let types = `export declare global {\nnamespace ${GRAPHQL_TYPES_NAMESPACE} {\nnamespace GraphQL {\nnamespace ${GRAPHQL_INTROSPECTION_VERSION} {\n`;

    console.info(":: generating types:\n");

    const enumNames = new Set(
      data.__schema.types
        .filter((type: IntrospectionType) => type.kind === "ENUM")
        .map((type: IntrospectionType) => type.name),
    );

    // generate ENUM types
    data.__schema.types.forEach((type: IntrospectionType) => {
      if (!type.name.startsWith("__")) {
        if (type.kind === "ENUM" && "enumValues" in type) {
          types += `enum ${type.name} {\n`;
          console.info(type.name);
          (type as IntrospectionEnumType).enumValues.forEach((enumValue) => {
            types += `  ${enumValue.name} = "${enumValue.name}",\n`;
          });
          types += "}\n\n";
        }
      }
    });

    // generate OBJECT types
    data.__schema.types.forEach((type: IntrospectionType) => {
      if (!type.name.startsWith("__")) {
        if (
          type.kind === "OBJECT" &&
          "fields" in type &&
          Array.isArray(type.fields)
        ) {
          types += `interface ${type.name} {\n`;
          console.info(type.name);
          type.fields.forEach((field: IntrospectionField) => {
            if (field && field.name && field.type) {
              const { typeName, isOptional, isEnum } = getFieldType(
                field.type,
                enumNames,
              );
              const finalTypeName = isEnum ? `\`\${${typeName}}\`` : typeName;
              types += `  ${field.name}${isOptional ? "?" : ""}: ${finalTypeName};\n`;
            } else {
              console.warn(
                `skipping field due to missing data: ${JSON.stringify(field)}`,
              );
            }
          });
          types += "}\n\n";
        } else if (
          type.kind === "INPUT_OBJECT" &&
          "inputFields" in type &&
          Array.isArray(type.inputFields)
        ) {
          types += `interface ${type.name} {\n`;
          console.info(type.name);
          type.inputFields.forEach((field: IntrospectionInputValue) => {
            if (field && field.name && field.type) {
              const { typeName, isOptional, isEnum } = getFieldType(
                field.type,
                enumNames,
              );
              const finalTypeName = isEnum ? `\`\${${typeName}}\`` : typeName;
              types += `  ${field.name}${isOptional ? "?" : ""}: ${finalTypeName};\n`;
            } else {
              console.warn(
                `skipping input field due to missing data: ${JSON.stringify(field)}`,
              );
            }
          });
          types += "}\n\n";
        } else if (
          type.kind === "UNION" &&
          "possibleTypes" in type &&
          Array.isArray(type.possibleTypes)
        ) {
          types += `type ${type.name} = ${type.possibleTypes.map((t) => t.name).join(" | ")};\n\n`;
        }
      }
    });

    // generate ARGUMENT types for queries and mutations
    data.__schema.types.forEach((type: IntrospectionType) => {
      if (type.name === "Query" || type.name === "Mutation") {
        if ("fields" in type && Array.isArray(type.fields)) {
          type.fields.forEach((field: IntrospectionField) => {
            if (field.args && field.args.length > 0) {
              types += `interface ${field.name}${type.name}Args {\n`;
              field.args.forEach((arg: IntrospectionInputValue) => {
                if (arg && arg.name && arg.type) {
                  const { typeName, isOptional, isEnum } = getFieldType(
                    arg.type,
                    enumNames,
                  );
                  const finalTypeName = isEnum
                    ? `\`\${${typeName}}\``
                    : typeName;
                  types += `  ${arg.name}${isOptional ? "?" : ""}: ${finalTypeName};\n`;
                }
              });
              types += "}\n\n";
            }
          });
        }
      }
    });

    types += "}\n}\n}\n}";

    const fullContent = FILE_HEADER + types;
    await fs.writeFile(GRAPHQL_TYPES_FILE_OUTPUT, fullContent);
    console.info(
      `\n:: GraphQL types file generated: ${GRAPHQL_TYPES_FILE_OUTPUT}\n`,
    );
  } catch (error) {
    console.error(":: error generating types:", error);
  }
};

generateGraphQLTypes();
