import { InfoContainer } from "@/components/InfoContainer";
import { InfoItem } from "@/components/InfoItem";

interface AccountSubscriptionDetailsProps {
  subscription: API.GraphQL.v1.Subscription;
}

export const AccountSubscriptionDetails = ({
  subscription,
}: AccountSubscriptionDetailsProps) => {
  // rendering

  return (
    <InfoContainer>
      <InfoItem label="Type" value={subscription.type} />
      <InfoItem label="Status" value={subscription.status} />
    </InfoContainer>
  );
};
