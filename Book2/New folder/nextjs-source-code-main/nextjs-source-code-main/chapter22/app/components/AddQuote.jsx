"use client";
import { useState } from "react";

const AddQuote = () => {
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <div>
      <button className="btn" onClick={() => setModalOpen(true)}>
        Add New Quote
      </button>
      <dialog
        id="my_modal_3"
        className={`modal ${modalOpen ? "modal-open" : ""}`}
      >
        <form method="dialog" className="modal-box">
          <button
            onClick={() => setModalOpen(false)}
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg">Add Quote</h3>
        </form>
      </dialog>
    </div>
  );
};
export default AddQuote;
