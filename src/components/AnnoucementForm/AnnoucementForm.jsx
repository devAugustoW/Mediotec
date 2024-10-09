import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext/AuthContext";
import "./AnnoucementForm.css";

const AnnouncementForm = ({ onSubmit, onCancel, initialData, allClasses }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetClass, setTargetClass] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setTargetClass(
        initialData.targetClasses && Array.isArray(initialData.targetClasses)
          ? initialData.targetClasses.map((cls) => cls._id || cls)
          : []
      );
    } else {
      // Resetar os campos se não houver dados iniciais
      setTitle("");
      setContent("");
      setTargetClass([]);
    }
  }, [initialData]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectChange = (classId) => {
    if (classId === "all") {
      if (targetClass.length === allClasses.length) {
        setTargetClass([]);
      } else {
        setTargetClass(allClasses.map((cls) => cls._id));
      }
    } else {
      setTargetClass((prevSelected) =>
        prevSelected.includes(classId)
          ? prevSelected.filter((id) => id !== classId)
          : [...prevSelected, classId]
      );
    }
  };

  const handleOkClick = () => {
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, targetClasses: targetClass });
  };

  const getSelectedClassNames = () => {
    if (targetClass.length === allClasses.length) {
      return "Todas as Turmas";
    }
    const selectedNames = allClasses
      .filter((cls) => targetClass.includes(cls._id))
      .map((cls) => cls.name);
    return selectedNames.join(", ") || "Selecionar uma Turma";
  };

  return (
    <form onSubmit={handleSubmit} className="announcement-form">
      <div>
        <label>Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Conteúdo</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Classes</label>
        <div className="custom-select">
          <div onClick={toggleDropdown} className="select-trigger">
            {getSelectedClassNames()}
          </div>
          {isDropdownOpen && (
            <div className="select-options">
              <div
                className={`option ${
                  targetClass.length === allClasses.length ? "selected" : ""
                }`}
                onClick={() => handleSelectChange("all")}
              >
                Selecionar Todas
              </div>
              {allClasses.map((cls) => (
                <div
                  key={cls._id}
                  className={`option ${
                    targetClass.includes(cls._id) ? "selected" : ""
                  }`}
                  onClick={() => handleSelectChange(cls._id)}
                >
                  {cls.name}
                </div>
              ))}
              <button
                type="button"
                onClick={handleOkClick}
                className="ok-button"
              >
                OK
              </button>
            </div>
          )}
        </div>
      </div>
      <button type="submit">{initialData ? "Atualizar" : "Salvar"}</button>
      <button type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
};

export default AnnouncementForm;
