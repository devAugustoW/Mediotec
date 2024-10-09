import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext/AuthContext";
import FormRegister from "../FormRegister/FormRegister";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./CoordinatorList.css";

const CoordinatorList = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCoordinator, setEditingCoordinator] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchCoordinators();
  }, [token]);

  const fetchCoordinators = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredCoordinators = response.data.filter(
        (user) => user.userType === "coordenador"
      );
      setCoordinators(filteredCoordinators);
    } catch (error) {
      console.error("Erro ao buscar coordenadores:", error);
      setError("Não foi possível carregar a lista de coordenadores.");
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
        console.log("Coordenador cadastrado com sucesso:", response.data);
        setShowForm(false);
        fetchCoordinators();
      }
    } catch (error) {
      console.error("Erro ao cadastrar coordenador:", error);
      if (error.response) {
        setError(
          error.response.data.error ||
            "Não foi possível cadastrar o coordenador."
        );
      } else {
        setError("Erro de conexão. Tente novamente mais tarde.");
      }
    }
  };

  const handleUpdateSubmit = async (userData) => {
    console.log("Dados da atualização:", {
      nome: userData.name,
      email: userData.email,
      senha: userData.password,
      userType: userData.userType,
      token: token,
    });

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
        console.log("Coordenador atualizado com sucesso:", response.data);
        setShowForm(false);
        setEditingCoordinator(null); // Limpa o coordenador em edição
        fetchCoordinators();
      }
    } catch (error) {
      console.error("Erro ao atualizar coordenador:", error);
      if (error.response) {
        setError(
          error.response.data.error ||
            "Não foi possível atualizar o coordenador."
        );
      } else {
        setError("Erro de conexão. Tente novamente mais tarde.");
      }
    }
  };

  const handleEditCoordinator = (coordinatorId) => {
    const coordinatorToEdit = coordinators.find(
      (coordinator) => coordinator._id === coordinatorId
    );
    setEditingCoordinator(coordinatorToEdit);
    setShowForm(true);
  };

  const handleDeleteCoordinator = async (coordinatorId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/users/${coordinatorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("Coordenador deletado com sucesso:", response.data.message);
        fetchCoordinators(); // Atualiza a lista de coordenadores após a exclusão
      }
    } catch (error) {
      console.error("Erro ao deletar coordenador:", error);
      if (error.response) {
        if (error.response.status === 403) {
          setError(
            "Acesso negado. Apenas coordenadores podem deletar usuários."
          );
        } else if (error.response.status === 404) {
          setError("Usuário não encontrado.");
        } else {
          setError(
            error.response.data.error ||
              "Não foi possível deletar o coordenador."
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
    <div className="coordinator-list-container">
      <h2>Gerenciamento de Coordenadores</h2>
      <div className="button-container">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingCoordinator(null); // Limpa o coordenador em edição ao criar novo
          }}
          className="toggle-button"
        >
          {showForm ? "Voltar para Lista" : "Cadastrar Novo Coordenador"}
        </button>
      </div>

      {showForm ? (
        <FormRegister
          onSubmit={
            editingCoordinator ? handleUpdateSubmit : handleRegisterSubmit
          }
          userType="coordenador"
          initialData={editingCoordinator}
        />
      ) : (
        <>
          {coordinators.length === 0 ? (
            <p>Nenhum coordenador encontrado.</p>
          ) : (
            <table className="coordinator-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th className="actions-column">Ações</th>
                </tr>
              </thead>
              <tbody>
                {coordinators.map((coordinator) => (
                  <tr key={coordinator._id}>
                    <td>{coordinator.name}</td>
                    <td>{coordinator.email}</td>
                    <td className="action-column">
                      <FaEdit
                        onClick={() => handleEditCoordinator(coordinator._id)}
                        className="action-button action-button--edit"
                        title="Editar"
                      />
                      <FaTrash
                        onClick={() => handleDeleteCoordinator(coordinator._id)}
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

export default CoordinatorList;
