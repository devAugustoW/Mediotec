import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext/AuthContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import AnnouncementForm from "../AnnoucementForm/AnnoucementForm";
import "./AnnoucementList.css";

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchAnnouncements();
    fetchAllClasses();
  }, [token]);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:3000/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Erro ao buscar anúncios:", error);
      setError("Não foi possível carregar a lista de anúncios.");
    }
  };

  const fetchAllClasses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getAllClasses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllClasses(response.data);
    } catch (error) {
      console.error("Erro ao buscar todas as turmas:", error);
    }
  };

  const handleCreateAnnouncement = async (announcementData) => {
    try {
      await axios.post(
        "http://localhost:3000/announcements",
        announcementData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAnnouncements();
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao criar anúncio:", error);
      setError("Não foi possível criar o anúncio.");
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
  };

  const handleUpdateAnnouncement = async (updatedData) => {
    try {
      await axios.put(
        `http://localhost:3000/announcements/${editingAnnouncement._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAnnouncements();
      setShowForm(false);
      setEditingAnnouncement(null);
    } catch (error) {
      console.error("Erro ao atualizar anúncio:", error);
      setError("Não foi possível atualizar o anúncio.");
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (window.confirm("Tem certeza que deseja deletar este anúncio?")) {
      try {
        await axios.delete(
          `http://localhost:3000/announcements/${announcementId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        fetchAnnouncements();
      } catch (error) {
        console.error("Erro ao deletar anúncio:", error);
        setError("Não foi possível deletar o anúncio.");
      }
    }
  };

  const renderClassesColumn = (targetClasses) => {
    if (targetClasses.length === allClasses.length) {
      return "Todas as Turmas";
    }
    return targetClasses.map((cls) => cls.name).join(", ");
  };

  return (
    <div className="announcement-list-container">
      <h2>Gerenciamento de Comunicados</h2>
      <button
        onClick={() => {
          setShowForm(true);
          setEditingAnnouncement(null);
        }}
      >
        Criar Comunicado
      </button>
      {showForm && (
        <AnnouncementForm
          onSubmit={
            editingAnnouncement
              ? handleUpdateAnnouncement
              : handleCreateAnnouncement
          }
          onCancel={() => {
            setShowForm(false);
            setEditingAnnouncement(null);
          }}
          initialData={editingAnnouncement}
          allClasses={allClasses}
        />
      )}
      {error && <p className="error-message">{error}</p>}
      {announcements.length === 0 ? (
        <p>Nenhum comunicado encontrado.</p>
      ) : (
        <table className="announcement-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Conteúdo</th>
              <th>Classes</th>
              <th>Criador</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => (
              <tr key={announcement._id}>
                <td>{announcement.title}</td>
                <td>{announcement.content}</td>
                <td>{renderClassesColumn(announcement.targetClasses)}</td>
                <td>{announcement.createdBy.name}</td>
                <td>
                  <FaEdit
                    onClick={() => handleEditAnnouncement(announcement)}
                    className="action-button action-button--edit"
                    title="Editar"
                  />
                  <FaTrash
                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                    className="action-button action-button--delete"
                    title="Deletar"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AnnouncementList;
