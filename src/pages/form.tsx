import { Window } from "@/components/window";
import { useSession } from "next-auth/react";
import { Fieldset, Legend, Transition } from "@headlessui/react";
import { useAutoToggle } from "@/hooks/useAutoToggle";
import { useRouter } from "next/router";
import { FormItem } from "@/components/form/formItem";
import questions from "@/constants/form.json";
import { makeForm } from "@/utils/makeForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function Form() {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  const show = useAutoToggle(100);
  const { data } = useSession({
    required: true,
    onUnauthenticated: () => router.push("/"),
  });
  const user = data?.user;

  useEffect(() => {
    //detect if another event listener is already attached
    const handler = (e: KeyboardEvent) => {
      if (e.key == "Enter") {
        const activeElement = document.activeElement as HTMLElement;

        if (!(activeElement instanceof HTMLTextAreaElement)) {
          e.preventDefault();
        }
      }
    };

    window.removeEventListener("keydown", handler);
    window.addEventListener("keydown", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setDisabled(true);
    const toastId = toast("Enviando formulario...", {
      isLoading: true,
      position: "top-center",
      closeButton: false,
      closeOnClick: false,
    });

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const form = await makeForm(data).catch(() =>
      toast.error("Error al enviar el formulario", { updateId: toastId })
    );

    // check if image is larger than 5MB
    for (const [key, value] of Object.entries(form)) {
      if (value.type == "attachment") {
        const file = formData.get(key) as File;

        if (file.size > 5 * 1024 * 1024) {
          toast.update(toastId, {
            render: "La imagen es demasiado grande",
            type: "error",
          });
          return;
        }
      }
    }

    if (form) {
      axios
        .post("/api/form", form)
        .then(() => {
          toast.update(toastId, {
            render: "Formulario enviado correctamente",
            type: "success",
          });
          setTimeout(() => {
            router.push("/");
          }, 3000);
        })
        .catch((err) => {
          toast.update(toastId, { render: err.response.data.error });
        });
    }
  };

  return (
    <div className={"flex w-full h-screen items-center justify-center"}>
      <Transition
        show={show}
        appear
        // as={"div"}
        enter="transition duration-300"
        enterFrom="opacity-0 scale-90"
        leave="transition duration-300"
        leaveFrom="opacity-100 opacity-100"
        leaveTo="opacity-0"
        // className={"mx-auto w-screen max-w-screen-md max-h-screen p-5"}
      >
        <Window
          draggable={true}
          id="window"
          title={"Los Santos Police Department"}
        >
          <div className="flex sm:justify-between sm:items-center flex-col sm:flex-row">
            <h1 className={"text-2xl text-ctp-green"}>Formulario</h1>
            <span className={"text-sm"}>Accediste como @{user?.name}</span>
          </div>
          <form
            onSubmit={handleSubmit}
            className={
              "flex flex-col gap-10 max-h-96 overflow-y-scroll overflow-x-auto pr-1"
            }
          >
            {questions.map((section, sectionIndex) => (
              <Fieldset
                key={section.sectionName}
                className={"flex flex-col gap-3 w-full"}
              >
                <Legend as={"h2"} className={"text-xl text-ctp-rosewater"}>
                  {section.sectionName}
                </Legend>
                {section.questions.map((question, index) => (
                  <FormItem
                    key={index}
                    question={question}
                    id={`${sectionIndex}_${index}`}
                  />
                ))}
              </Fieldset>
            ))}

            <button
              type={"submit"}
              className="bg-ctp-peach hover:bg-ctp-peach/80 text-ctp-base px-3 py-2"
              // disabled={disabled}
            >
              Enviar
            </button>
          </form>
        </Window>
      </Transition>

      <ToastContainer theme={"dark"} />
    </div>
  );
}
