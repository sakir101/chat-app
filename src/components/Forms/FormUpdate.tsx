"use client";

import { ReactElement, ReactNode, useEffect, useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";

type FormConfig = {
  defaultValues?: Record<string, any>;
  resolver?: any;
};

type FormProps = {
  children?: ReactElement | ReactNode;
  submitHandler: SubmitHandler<any>;
  formKey: string;
} & FormConfig;

const FormUpdate = ({
  children,
  submitHandler,
  defaultValues,
  resolver,
  formKey,
}: FormProps) => {
  const formConfig: FormConfig = {};

  if (!!defaultValues) formConfig["defaultValues"] = defaultValues;
  if (!!resolver) formConfig["resolver"] = resolver;
  const methods = useForm<FormProps>(formConfig);

  const { handleSubmit, reset, watch } = methods;
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const onSubmit = async (data: any) => {
    await submitHandler(data);
    reset();
    setShouldResetForm(true);
  };

  useEffect(() => {
    const storedFormValues = localStorage.getItem(`formValues_${formKey}`);

    if (storedFormValues) {
      reset(JSON.parse(storedFormValues));
      setShouldResetForm(true);
      return;
    } else {
      if (defaultValues) {
        reset(defaultValues);
      }
    }
  }, [reset, formKey, defaultValues]);

  useEffect(() => {
    const watchSubscription: any = watch((formValues: any) => {
      localStorage.setItem(`formValues_${formKey}`, JSON.stringify(formValues));
    });

    return () => {
      watchSubscription.unsubscribe();
    };
  }, [watch, formKey]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default FormUpdate;
