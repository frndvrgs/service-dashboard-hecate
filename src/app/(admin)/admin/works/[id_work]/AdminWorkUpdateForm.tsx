import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useOperationStatus } from "@/hooks/useOperationStatus";
import { useServerAction } from "@/hooks/useServerAction";
import { updateWork, commandWork } from "@/actions/product";
import { FieldInput } from "@/components/FieldInput";
import { isEqual } from "lodash-es";

interface AdminWorkUpdateForm {
  work: API.GraphQL.v1.Work;
}

type FormData = API.GraphQL.v1.UpdateWorkInput & { command: string };

export const AdminWorkUpdateForm = ({ work }: AdminWorkUpdateForm) => {
  // external hooks
  const queryClient = useQueryClient();
  const { operationStatus, updateOperationStatus } = useOperationStatus();

  const updateAction = useServerAction(updateWork);
  const commandAction = useServerAction(commandWork);

  const workForm = useForm<FormData>({
    defaultValues: {
      name: "",
      level: 0,
      command: "",
    },
    mode: "onBlur",
  });

  // effects

  useEffect(() => {
    if (work) {
      const { name, level } = work;
      workForm.setValue("name", name);
      workForm.setValue("level", level);
    }
  }, [work, workForm.setValue]);

  // handlers

  const handleUpdateWork = async (
    fieldName: keyof Omit<FormData, "command">,
  ) => {
    if (!(await workForm.trigger(fieldName))) return;

    const newValue = workForm.getValues(fieldName);
    const currentValue = work[fieldName];

    if (isEqual(newValue, currentValue)) return;

    const operationName = `update_${fieldName}`;

    updateOperationStatus(operationName, "loading");

    const { data, error } = await updateAction.execute({
      account: work.id_account,
      work: work.id_work,
      input: { [fieldName]: newValue },
    });

    if (error) {
      console.error("update work error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("update work error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("update work:", data);
      updateOperationStatus(operationName, "success");
      await queryClient.invalidateQueries({
        queryKey: [`work_${work.id_work}`],
      });
    }
  };

  const handleCommandWork = async () => {
    if (!(await workForm.trigger("command"))) return;

    const value = workForm.getValues("command");

    const operationName = "commandWork";

    updateOperationStatus(operationName, "loading");

    const { data, error } = await commandAction.execute({
      account: work.id_account,
      work: work.id_work,
      command: value,
    });

    if (error) {
      console.error("command work error", error);
      updateOperationStatus(operationName, "error", error);
      return;
    }

    if (data?.status.isError) {
      console.error("command work error", data.status);
      updateOperationStatus(operationName, "error", data.status);
      return;
    }

    if (data) {
      console.log("command work:", data);
      updateOperationStatus(operationName, "success");
      await queryClient.invalidateQueries({
        queryKey: [`work_${work.id_work}`],
      });
    }
  };

  // rendering

  return (
    <form className="space-y-6">
      <Controller
        name="name"
        control={workForm.control}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="name"
            label="name"
            status={operationStatus["update_name"]?.status}
            onBlur={() => {
              if (fieldState.isDirty) {
                handleUpdateWork("name");
              }
            }}
          />
        )}
      />
      <Controller
        name="level"
        control={workForm.control}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="level"
            label="level"
            status={operationStatus["update_level"]?.status}
            onBlur={() => {
              if (fieldState.isDirty) {
                handleUpdateWork("level");
              }
            }}
          />
        )}
      />
      <Controller
        name="command"
        control={workForm.control}
        render={({ field, fieldState }) => (
          <FieldInput
            field={field}
            fieldState={fieldState}
            name="command"
            label="command"
            placeholder="dump_source_code | analyze_source_code | watch_pull_requests | interrupt_process"
            status={operationStatus["commandWork"]?.status}
            onBlur={() => {
              if (fieldState.isDirty) {
                handleCommandWork();
              }
            }}
          />
        )}
      />
    </form>
  );
};
