import React from "react";
import { CreateActivityWizard } from "@/components/create-activity/wizard";
import { env } from "@/lib/utils/env";

const CreateActivityPage: React.FC = () => {
  const key = env.googleMapsApiKey || "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <CreateActivityWizard mapKey={key} />
    </div>
  );
};

export default CreateActivityPage;
