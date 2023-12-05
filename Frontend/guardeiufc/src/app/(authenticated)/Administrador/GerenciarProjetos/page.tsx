"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Select from "react-select";
import { axios } from "@/config/axios";
import { AxiosResponse, AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Responsavel {
  registration: number;
  name: string;
  email: string;
}

interface Projeto {
  name: string;
  coordinatorRegistration: number;
}
interface ErrorInfo {
  message: string;
  mensagem: string;
}


function EditarProjetos() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEditDelete, setShowEditDelete] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchable, setIsSearchable] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState<string>("");
  const router = useRouter();
  const [formData, setFormData] = useState<Projeto>({
    name: "",
    coordinatorRegistration: 0,
  });
  const [selectedResponsavel, setSelectedResponsavel] =
    useState<Responsavel | null>(null);
  const [selectedProjeto, setSelectedProjeto] = useState<Projeto>({
    name: "",
    coordinatorRegistration: 0,
  });
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([
    {
      registration: 1,
      name: "",
      email: "",
    },
  ]);
  const [projetos, setProjetos] = useState<Projeto[]>([
    { name: "", coordinatorRegistration: 1 },
  ]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com a mudança nos campos de entrada
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const limparCampos = () => {
    setFormData({
      name: "",
      coordinatorRegistration: 0,
    });
    setSelectedResponsavel(null);
    setSelectedProjeto({
      name: "",
      coordinatorRegistration: 0,
    });
  };
  // Verifica se a outra tela não está aberta antes de abrir a tela desejada
  const telaCriacaoClicada = () => {
    if (!showEditDelete) {
      setShowCreate(!showCreate);
    }
    limparCampos();
  };
  // Verifica se a outra tela não está aberta antes de abrir a tela desejada
  const telaEdicaoClicada = () => {
    if (!showCreate) {
      setShowEditDelete(!showEditDelete);
    }
    limparCampos();
  };
  const validateData = (name: String, cooordinationRegistration: number) => {
    if (name == "" || cooordinationRegistration == 0) {
      return false;
    }
    return true;
  };

  const cadastrarProjeto = () => {
    const dataIsValid = validateData(
      formData.name,
      selectedResponsavel ? selectedResponsavel.registration : 0
    );
    if (!dataIsValid) {
      Swal.fire({
        icon: "warning",
        text: "Informe o nome e o responsavel para cadastrar um projeto!",
      });
      return;
    }
    const idResponsavel = selectedResponsavel?.registration;
    axios
      .post("/project", {
        name: formData.name,
        coordinatorRegistration: idResponsavel,
      })
      .then((response: AxiosResponse) => {
        if (response.status == 201) {
          Swal.fire({
            icon: "info",
            text: "Projeto cadastrado com sucesso!",
          });
          limparCampos();
        }
      })
      .catch((error) => {
        if (error.response?.status == 400) {
          const error_info  = error.response?.data as ErrorInfo;
          Swal.fire({
            icon: 'error',
            text: `${error_info.mensagem}!`
          });
        }
        else if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para cadastrar projeto!",
          }).then(() => {
            router.push("/TelaLogin");
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar cadastrar projeto.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };

  //Editar Projeto
  const editarProjeto = () => {
    if (!selectedProjeto || !selectedResponsavel || !editedProjectName.trim()) {
      Swal.fire({
        icon: "warning",
        text: "Forneça as informações necessárias!",
      });
      return;
    }
    const nomeProj = selectedProjeto?.name;
    axios
      .put(`/project/${nomeProj}`, {
        name: editedProjectName,
        coordinatorRegistration: selectedResponsavel?.registration,
      })
      .then((response: AxiosResponse) => {
        if (response.status == 201) {
          Swal.fire({
            icon: "info",
            text: "Projeto editado com sucesso!",
          });
          limparCampos();
        }
      })
      .catch((error) => {
        if (error.response?.status == 400) {
          const error_info  = error.response?.data as ErrorInfo;
          Swal.fire({
            icon: 'error',
            text: `${error_info.mensagem}`
          });
        }
        if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para editar projeto!",
          }).then(() => {
            router.push("/TelaLogin");
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar editar projeto.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };

  const excluirProjeto = () => {
    if (!selectedProjeto || !selectedResponsavel) {
      Swal.fire({
        icon: "warning",
        text: "Forneça as informações necessárias!",
      });
      return;
    }
    const nomeProj = selectedProjeto?.name;
    axios
      .delete(`/project/${nomeProj}`, {
      })
      .then((response: AxiosResponse) => {
        if (response.status == 200) {
          Swal.fire({
            icon: "info",
            text: "Projeto excluido com sucesso!",
          });
          limparCampos();
        }
      })
      .catch((error) => {
        if (error.response?.status == 400) {
          const error_info  = error.response?.data as ErrorInfo;
          Swal.fire({
            icon: 'error',
            text: `${error_info.mensagem}`
          });
        }
        if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para editar projeto!",
          }).then(() => {
            router.push("/TelaLogin");
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar excluir projeto.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get("/employee")
      .then((response) => {
        if (response.status == 200) {
          setResponsaveis(response.data.employees);
        }
      })
      .catch((error: AxiosError) => {
        if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para acessar a tela!",
          }).then(({ value }) => {
            if (value == true) {
              router.push("/TelaLogin");
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar inicializar a tela. Tente novamente!\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
    axios
      .get("/project")
      .then((response) => {
        if (response.status == 200) {
          setProjetos(response.data.projects);
        }
      })
      .catch((error: AxiosError) => {
        if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para gerar relatório de itens!",
          }).then(({ value }) => {
            if (value == true) {
              router.push("/TelaLogin");
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar inicializar a tela. Tente novamente!\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  }, [showCreate, selectedResponsavel]);

  useEffect(() => {
    if (selectedProjeto && selectedProjeto.coordinatorRegistration) {
      const responsavelSelecionado = responsaveis.find(
        (r) => r.registration === selectedProjeto.coordinatorRegistration
      );
      if (responsavelSelecionado) {
        const responsavelData = {
          label: `${responsavelSelecionado.registration} - ${responsavelSelecionado.name}`,
          value: responsavelSelecionado.registration,
          name: responsavelSelecionado.name,
          registration: responsavelSelecionado.registration,
          email: responsavelSelecionado.email,
        };
        setSelectedResponsavel(responsavelData);
      }
    }
    if (selectedProjeto) {
      setEditedProjectName(selectedProjeto.name || "");
    }
  }, [selectedProjeto]);

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.estiloCadastro}>
          <p>Gerenciar Projetos</p>
        </div>
        <div className={styles.botoes}>
          <button
            className={`${styles.EstilobotaoMenu} ${
              showCreate ? styles.buttonSelected : styles.buttonUnselected
            }`}
            onClick={telaCriacaoClicada}
          >
            Criar Projeto
          </button>
          <button
            className={`${styles.EstilobotaoMenu} ${
              showEditDelete ? styles.buttonSelected : styles.buttonUnselected
            }`}
            onClick={telaEdicaoClicada}
          >
            Editar/Excluir Projeto
          </button>
        </div>
        {showCreate && (
          <div>
            <div className={styles.containerPrincipal}>
              <div className={styles.inputContainer2}>
                <p className={styles.Nomes}>Nome do projeto</p>
                <input
                  type="text"
                  id="projeto"
                  name="name"
                  value={formData.name}
                  placeholder="Digite o nome do projeto"
                  className={styles.input}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Responsável</p>
                  <Select
                    value={selectedResponsavel}
                    onChange={(selectedOption) =>
                      setSelectedResponsavel(selectedOption as Responsavel)
                    }
                    options={
                      responsaveis
                        ? responsaveis.map((responsavel) => ({
                            label: `${responsavel.registration} - ${responsavel.name}`,
                            value: responsavel.registration,
                            name: responsavel.name,
                            registration: responsavel.registration,
                            email: responsavel.email,
                          }))
                        : []
                    }
                    isSearchable
                    placeholder="Selecione um responsável"
                    noOptionsMessage={() => "Nenhuma opção disponível"}
                  />
                </div>
              </div>
            </div>
            <div className={styles.botoesInferiores}>
              <p className={styles.estiloBotao} onClick={cadastrarProjeto}>
                Criar Projeto
              </p>
            </div>
          </div>
        )}

        {showEditDelete && (
          <div className={styles.conteudo}>
            <div className={styles.containerBuscar}>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Selecione um projeto</p>
                  <Select
                    value={selectedProjeto}
                    onChange={(selectedOption) => {
                      setSelectedProjeto(selectedOption as Projeto);
                    }}
                    options={projetos.map((projeto) => ({
                      label: `${projeto.name}`,
                      value: projeto.name,
                      name: projeto.name,
                      coordinatorRegistration: projeto.coordinatorRegistration,
                    }))}
                    isSearchable
                    placeholder="Selecione um projeto"
                    noOptionsMessage={() => "Nenhuma opção disponível"}
                  />
                </div>
              </div>
            </div>
            <div className={styles.containerPrincipal}>
              <div className={styles.inputContainer}>
                <p className={styles.Nomes}>Nome do Projeto</p>
                <input
                  type="text"
                  id="nomeProjeto"
                  name="nomeProjeto"
                  placeholder="Nome do projeto"
                  value={editedProjectName}
                  onChange={(e) => setEditedProjectName(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Selecione um responsável</p>
                  <Select
                    value={selectedResponsavel}
                    
                    onChange={(selectedOption) =>
                      setSelectedResponsavel(selectedOption as Responsavel)
                    }
                    options={responsaveis.map((responsavel) => ({
                      label: `${responsavel.registration} - ${responsavel.name}`,
                      value: responsavel.registration,
                      name: responsavel.name,
                      registration: responsavel.registration,
                      email: responsavel.email,
                    }))}
                    isSearchable
                    placeholder="Selecione um responsável"
                    noOptionsMessage={() => "Nenhuma opção disponível"}
                  />
                </div>
              </div>
            </div>
            <div className={styles.botoesInferiores}>
              <p className={styles.estiloBotao} onClick={editarProjeto}>
                Salvar Alterações
              </p>
              <p className={styles.estiloBotaoExcluir} onClick = {excluirProjeto}>Excluir Projeto</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditarProjetos;
