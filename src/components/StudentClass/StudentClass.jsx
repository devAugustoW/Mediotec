import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext/AuthContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./StudentClass.css";

const StudentClass = () => {
  const [studentClasses, setStudentClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newAssociation, setNewAssociation] = useState({
    student: "",
    class: "",
  });
  const [editingAssociation, setEditingAssociation] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchStudentClasses();
    fetchStudents();
    fetchClasses();
  }, [token]);

  const fetchStudentClasses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/studentClass", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentClasses(response.data);
    } catch (error) {
      console.error("Erro ao buscar associações:", error);
      setError("Não foi possível carregar a lista de associações.");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredStudents = response.data.filter(
        (user) => user.userType === "aluno"
      );
      setStudents(filteredStudents);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      setError("Não foi possível carregar a lista de alunos.");
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getAllClasses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(response.data);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
      setError("Não foi possível carregar a lista de turmas.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/studentToClass",
        newAssociation,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        console.log("Associação criada com sucesso:", response.data);
        setShowForm(false);
        setNewAssociation({ student: "", class: "" });
        fetchStudentClasses();
      }
    } catch (error) {
      console.error("Erro ao criar associação:", error);
      setError("Não foi possível criar a associação.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/editStudentClass/${editingAssociation._id}`,
        newAssociation,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("Associação atualizada com sucesso:", response.data);
        setEditingAssociation(null);
        setNewAssociation({ student: "", class: "" });
        fetchStudentClasses();
      }
    } catch (error) {
      console.error("Erro ao atualizar associação:", error);
      setError("Não foi possível atualizar a associação.");
    }
  };

  const handleDeleteAssociation = async (associationId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/deleteStudentClass/${associationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        console.log("Associação deletada com sucesso:", response.data.message);
        fetchStudentClasses();
      }
    } catch (error) {
      console.error("Erro ao deletar associação:", error);
      setError("Não foi possível deletar a associação.");
    }
  };

  return (
    <div className="student-class-container">
      <h2>Gerenciamento de Alunos e Turmas</h2>
      <div className="button-container">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingAssociation(null);
          }}
          className="toggle-button"
        >
          {showForm ? "Voltar para Lista" : "Associar"}
        </button>
      </div>

      {showForm && !editingAssociation && (
        <form onSubmit={handleRegisterSubmit} className="association-form">
          <h3>Associar Aluno - Turma</h3> {/* Título para criação */}
          <select
            value={newAssociation.student}
            onChange={(e) =>
              setNewAssociation({ ...newAssociation, student: e.target.value })
            }
            required
          >
            <option value="">Selecione um Aluno</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name}
              </option>
            ))}
          </select>
          <select
            value={newAssociation.class}
            onChange={(e) =>
              setNewAssociation({ ...newAssociation, class: e.target.value })
            }
            required
          >
            <option value="">Selecione uma Turma</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.name}
              </option>
            ))}
          </select>
          <button type="submit">Associar</button>
          <button type="button" onClick={() => setShowForm(false)}>
            Fechar
          </button>{" "}
          {/* Botão para fechar o formulário */}
        </form>
      )}

      {editingAssociation && (
        <div className="edit-card">
          <h3>Editando Associação</h3>
          <p>Aluno: {editingAssociation.student.name}</p>
          <p>Turma: {editingAssociation.class.name}</p>
          <form onSubmit={handleEditSubmit} className="association-form">
            <select
              value={newAssociation.student}
              onChange={(e) =>
                setNewAssociation({
                  ...newAssociation,
                  student: e.target.value,
                })
              }
              required
            >
              <option value="">Selecione um Aluno</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
            <select
              value={newAssociation.class}
              onChange={(e) =>
                setNewAssociation({ ...newAssociation, class: e.target.value })
              }
              required
            >
              <option value="">Selecione uma Turma</option>
              {classes.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.name}
                </option>
              ))}
            </select>
            <button type="submit">Atualizar</button>
            <button type="button" onClick={() => setEditingAssociation(null)}>
              Fechar
            </button>{" "}
            {/* Botão para fechar o formulário de edição */}
          </form>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {studentClasses.length === 0 ? (
        <p>Nenhuma associação encontrada.</p>
      ) : (
        <table className="association-table">
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Turma</th>
              <th className="actions-column">Ações</th>
            </tr>
          </thead>
          <tbody>
					{studentClasses.map((studentClass) => (
						<tr key={studentClass._id}>
							<td>{studentClass.student?.name || 'Nome não disponível'}</td>
							<td>{studentClass.class?.name || 'Turma não disponível'}</td>
							<td className="action-column">
								<FaEdit
									onClick={() => {
										setEditingAssociation(studentClass);
										setNewAssociation({
											student: studentClass.student?._id || '',
											class: studentClass.class?._id || '',
										});
										setShowForm(false);
									}}
									className="action-button action-button--edit"
									title="Editar"
								/>
								<FaTrash
									onClick={() => handleDeleteAssociation(studentClass._id)}
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

export default StudentClass;
