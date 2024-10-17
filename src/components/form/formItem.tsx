import { Field, Input, Label, Textarea } from "@headlessui/react";

interface Question {
  question: string;
  type: string;
}

export function FormItem({ question, id }: { question: Question; id: string }) {
  let itemToRender = <></>;

  switch (question.type) {
    case "text":
    case "number":
      itemToRender = (
        <Input
          className={
            "block w-full outline-none bg-ctp-surface0 hover:bg-ctp-surface2 focus:bg-ctp-surface1 py-1.5 px-3 text-sm/6 text-white"
          }
          name={id}
          type={question.type}
          required
          {...(question.type == "number"
            ? { max: 999, maxLength: 3 }
            : { maxLength: 1024 })}
        />
      );
      break;

    case "paragraph":
      itemToRender = (
        <Textarea
          className={
            "block w-full resize-none outline-none bg-ctp-surface0 border border-transparent hover:border-white focus:bg-ctp-surface1 py-1.5 px-3 text-sm/6 text-white"
          }
          required
          maxLength={4096}
          name={id}
        />
      );
      break;

    case "attachment":
      itemToRender = (
        <Input required name={id} id={id} type="file" className={"z-10"}
        accept="image/*"
        />
      );
      break;

    default:
      itemToRender = <></>;
      break;
  }

  return (
    <Field className={"flex flex-col gap-2 w-auto"}>
      <Label>{question.question}</Label>
      {itemToRender}
    </Field>
  );
}
