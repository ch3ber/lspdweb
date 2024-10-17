import { Window } from "@/components/window";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Transition } from "@headlessui/react";
import { useAutoToggle } from "@/hooks/useAutoToggle";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const show = useAutoToggle(500);
  const { status, data } = useSession();
  const user = data?.user;

  return (
    <div className={"flex h-screen items-center justify-center"}>
      <Image
        src={"/LSPD.webp"}
        alt={"LSPD logo"}
        width={200}
        height={200}
        draggable={false}
        className={
          "-z-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 undraggable"
        }
      />

      <Transition
        show={show}
        appear
        enter="transition duration-300"
        enterFrom="opacity-0 translate-y-10 scale-90"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transition duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Window
          id="window"
          title={"Los Santos Police Department"}
          className={"items-center"}
        >
          <div className={"flex gap-5 w-full justify-center"}>
            <Image
              src={"/LSPD.webp"}
              alt={"LSPD logo"}
              width={100}
              height={100}
            />
            <Image
              src={"/jerarquia.png"}
              alt={"Jerarquia RP logo"}
              width={100}
              height={100}
            />
          </div>
          <h1>Bienvenido {user?.name}</h1>
          {status == "loading" ? (
            <>Cargando</>
          ) : status == "authenticated" ? (
            <>
              <button
                onClick={() => router.push("/form")}
                className="bg-ctp-peach hover:bg-ctp-peach/80 text-ctp-base px-3 py-2"
              >
                Iniciar formulario
              </button>
              <button onClick={() => signOut()} className="hover:underline">
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("discord")}
              className="bg-ctp-lavender hover:bg-ctp-lavender/80 text-ctp-base px-3 py-2"
            >
              Acceder con Discord
            </button>
          )}
        </Window>
      </Transition>
    </div>
  );
}
