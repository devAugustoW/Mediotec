import { useState } from 'react';
import './Dashboard.css'; // Certifique-se de que o caminho está correto
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import StudentList from '../../../components/StudentList/StudentList';
import TeacherList from '../../../components/TeacherList/TeacherList';
import CoordinatorList from '../../../components/CoodinatorList/CoordinatorList';
import ClassList from '../../../components/ClassList/ClassList';
import SubjectList from '../../../components/DisciplineList/DisciplineList';
import TeacherDiscipline from '../../../components/TeacherDiscipline/TeacherDiscipline';
import ClassDiscipline from '../../../components/ClassDiscipline/ClassDiscipline';
import StudentClass from '../../../components/StudentClass/StudentClass';
import AnnouncementList from '../../../components/Annoucement/AnnoucementList';
import GradeCoordinator from '../../../components/GradeCoordinator/GradeCoordinator';

const DashboardCoordenador = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

	const renderContent = () => {
    switch (activeSection) {
      case 'alunos':
        return <StudentList />;
      case 'professores':
        return <TeacherList />;
      case 'coordenadores':
        return <CoordinatorList />; 
      case 'turmas':
        return <ClassList />; 
      case 'disciplinas':
        return <SubjectList />; 
      case 'teacher-discipline':
        return <TeacherDiscipline />;
      case 'class-discipline':
        return <ClassDiscipline />;
      case 'student-class':
        return <StudentClass />;
      case 'grade-coordinator':
        return <GradeCoordinator />; 
      case 'annoucement':
        return <AnnouncementList />;
      default:
        return <h2>Dashboard Coordenador</h2>;
    }
  };

  return (
    <div className='dashboardCoordinator'>
      <Header />
      <div className='dashboardWrapper'> 
        <Sidebar setActiveSection={setActiveSection} />
        <div className='dashboardContent'> 
          {renderContent()}
        </div>
      </div>
		</div>
  );
};

export default DashboardCoordenador;