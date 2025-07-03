import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useFormik } from "formik";
import * as yup from "yup";

import NumericInput, { NumericInputProps } from "./NumericInput";

const formSchema = yup.object({
  value: yup.string().required("This is a required field"),
});

const InputStories = (props: NumericInputProps) => {
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    enableReinitialize: true,
    validationSchema: formSchema,
    onSubmit: () => {},
  });

  return (
    <NumericInput
      {...props}
      label="Input Label"
      formik={formik}
      formikId="value"
    />
  );
};

export default {
  title: "components/molecules/Input/NumericInput",
  component: InputStories,
} as ComponentMeta<typeof InputStories>;

const Template: ComponentStory<typeof InputStories> = (args) => (
  <InputStories {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const WithCurrency = Template.bind({});
WithCurrency.args = {
  asset: "USD",
};
