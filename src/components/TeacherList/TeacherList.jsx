import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext/AuthContext";
import FormRegister from "../FormRegister/FormRegister";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./TeacherList.css";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchTeachers();
  }, [token]);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredTeachers = response.data.filter(
        (user) => user.userType === "professor"
      );
      setTeachers(filteredTeachers);
    } catch (error) {
      console.error("Erro ao buscar docentes:", error);
      setError("Não foi possível carregar a lista de docentes.");
    }
  };

  const handleRegisterSubmit = async (userData) => {
    console.log("Dados do cadastro:", {
      nome: userData.name,
      email: userData.email,
      senha: userData.password,
      userType: userData.userType,
      token: token,
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/createUserByCoordinator",
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          userType: userData.userType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        console.log("Docente cadastrado com sucesso:", response.data);
        setShowForm(false);
        fetchTeachers();
      }
    } catch (error) {
      console.error("Erro ao cadastrar professor:", error);
      if (error.response) {
        setError(
          error.response.data.error || "Não foi possível cadastrar o professor."
        );
      } else {
        setError("Erro de conexão. Tente novamente mais tarde.");
      }
    }
  };

  const handleUpdateSubmit = async (userData) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userData._id}`,
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          userType: userData.userType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("Docente atualizado com sucesso:", response.data);
        setShowForm(false);
        setEditingTeacher(null); // Limpa o professor em edição
        fetchTeachers();
      }
    } catch (error) {
      console.error("Erro ao atualizar professor:", error);
      if (error.response) {
        setError(
          error.response.data.error || "Não foi possível atualizar o professor."
        );
      } else {
        setError("Erro de conexão. Tente novamente mais tarde.");
      }
    }
  };

  const handleEditTeacher = (teacherId) => {
    const teacherToEdit = teachers.find((teacher) => teacher._id === teacherId);
    setEditingTeacher(teacherToEdit);
    setShowForm(true);
  };

  const handleDeleteTeacher = async (teacherId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/users/${teacherId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("Professor deletado com sucesso:", response.data.message);
        fetchTeachers(); // Atualiza a lista de Professores após a exclusão
      }
    } catch (error) {
      console.error("Erro ao deletar Professor:", error);
      if (error.response) {
        if (error.response.status === 403) {
          setError(
            "Acesso negado. Apenas coordenadores podem deletar usuários."
          );
        } else if (error.response.status === 404) {
          setError("Usuário não encontrado.");
        } else {
          setError(
            error.response.data.error || "Não foi possível deletar o professor."
          );
        }
      } else {
        setError("Erro de conexão. Tente novamente mais tarde.");
      }
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="teacher-list-container">
      <h2>Gerenciamento de Docentes</h2>
      <div className="button-container">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingTeacher(null); // Limpa o professor em edição ao criar novo
          }}
          className="toggle-button"
        >
          {showForm ? "Voltar para Lista" : "Cadastrar Novo Docente"}
        </button>
      </div>

      {showForm ? (
        <FormRegister
          onSubmit={editingTeacher ? handleUpdateSubmit : handleRegisterSubmit}
          userType="professor"
          initialData={editingTeacher}
        />
      ) : (
        <>
          {teachers.length === 0 ? (
            <p>Nenhum professor encontrado.</p>
          ) : (
            <table className="teacher-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th className="actions-column">Ações</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td>{teacher.name}</td>
                    <td>{teacher.email}</td>
                    <td className="action-column">
                      <FaEdit
                        onClick={() => handleEditTeacher(teacher._id)}
                        className="action-button action-button--edit"
                        title="Editar"
                      />
                      <FaTrash
                        onClick={() => handleDeleteTeacher(teacher._id)}
                        className="action-button action-button--delete"
                        title="Deletar"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherList;
