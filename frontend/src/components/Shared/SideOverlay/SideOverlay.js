import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function SideOverlay(props) {
  const { className, open, setOpen } = props;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 overflow-hidden"
        open={open}
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-24">
            <Transition.Child
              as={"div"}
              className={className}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              {props.children}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
