import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { LIST_ACCOUNTS } from "@/interface/v1/schemas/account";

const AdminSubscriptions = () => {
  const { data, isLoading, error } = useGraphQLQuery<
    API.GraphQL.v1.Query["listAccounts"]
  >(["accounts"], LIST_ACCOUNTS, { options: { take: 10 } });

  return (
    <section className="flex flex-col items-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Subscriptions</h1>
      <div className="w-full max-w-4xl">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading...</p>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-red-500">Error: {error.message}</p>
          </div>
        )}

        {!isLoading && !error && data && (
          <div className="bg-white shadow-md rounded-lg p-6">
            {data?.output.map((account) => (
              <div key={account.id_account}>{account.email}</div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminSubscriptions;
