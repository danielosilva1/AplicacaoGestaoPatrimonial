"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Select from "react-select";
import Swal from "sweetalert2";
import { axios } from "@/config/axios";
import { AxiosResponse, AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface FormData {
  bloco: string;
  sala: string;
}
interface Local {
  id: number;
  departmentBuilding: string;
  room: string;
}

interface ErrorResponse {
  message: string;
  mensagem: string;
}
interface ErrorInfo {
  message: string;
  mensagem: string;
}

function EditarLocal() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEditDelete, setShowEditDelete] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);
  const [formData, setFormData] = useState<FormData>({
    bloco: "",
    sala: "",
  });
  const router = useRouter();

  const [localizacoes, setLocalizacoes] = useState<Local[]>([
    { id: 1, departmentBuilding: "", room: "" },
  ]);

  // Verifica se a outra tela não está aberta antes de abrir a tela desejada
  const telaCriacaoClicada = () => {
    if (!showEditDelete) {
      setShowCreate(!showCreate);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com a mudança nos campos de entrada
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateData = (bloco: String, sala: String) => {
    if (bloco == "" || sala == "") {
      return false;
    }
    return true;
  };

  // Verifica se a outra tela não está aberta antes de abrir a tela desejada
  const telaEdicaoClicada = () => {
    if (!showCreate) {
      setShowEditDelete(!showEditDelete);
    }
  };

  const limparCampos = () => {
    setFormData({
      bloco: "",
      sala: "",
    });
    setSelectedLocal(null);
  };

  const cadastrarLocal = () => {
    const dataIsValid = validateData(formData.bloco, formData.sala);
    if (!dataIsValid) {
      Swal.fire({
        icon: "warning",
        text: "Informe o bloco e a sala para cadastrar um local!",
      });
      return;
    }

    axios
      .post("/local", {
        departmentBuilding: formData.bloco,
        room: formData.sala,
      })
      .then((response: AxiosResponse) => {
        if (response.status == 201) {
          Swal.fire({
            icon: "info",
            text: "Local cadastrado com sucesso!",
          });
          limparCampos();
        }
      })
      .catch((error) => {
        let mensagem = JSON.stringify(error.response?.data);
        let mensagemList = mensagem.split('"');
        if (error.response?.status == 400) {
          Swal.fire({
            icon: "error",
            text: `${mensagemList[3] + "!"}`,
          });
        }
        if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para cadastrar local!",
          }).then(() => {
            limparCampos();
            router.push("/TelaLogin");
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar cadastrar local.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };

  //Edicao do Local
  const editarLocal = () => {
    if (!selectedLocal) {
      Swal.fire({
        icon: "warning",
        text: "Selecione um local para editar!",
      });
      return;
    }
    const localId = selectedLocal?.id;
    axios
      .put(`/local/${localId}`, {
        departmentBuilding: selectedLocal?.departmentBuilding,
        room: selectedLocal?.room,
      })
      .then((response: AxiosResponse) => {
        if (response.status == 200) {
          Swal.fire({
            icon: "info",
            text: "Local atualizado com sucesso!",
          });
          limparCampos();
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 400) {
          const errorMessage = error.response?.data?.mensagem;
          if (errorMessage) {
            Swal.fire({
              icon: "error",
              text: errorMessage,
            });
          } else {
            Swal.fire({
              icon: "error",
              text: "Ocorreu um erro ao tentar editar local.",
            });
          }
        }
        if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para cadastrar local!",
          }).then(() => {
            limparCampos();
            router.push("/TelaLogin");
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar editar local.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };

  const excluirLocal = () => {
    if (!selectedLocal) {
      Swal.fire({
        icon: "warning",
        text: "Selecione um local para excluir!",
      });
      return;
    }
    const localId = selectedLocal?.id;
    axios
      .delete(`/local/${localId}`)
      .then((response: AxiosResponse) => {
        if (response.status == 200) {
          Swal.fire({
            icon: "info",
            text: "Local excluído com sucesso!",
          });
          limparCampos();
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 400) {
          const errorMessage = error.response?.data?.mensagem;
          if (errorMessage) {
            Swal.fire({
              icon: "error",
              text: errorMessage,
            });
          } else {
            Swal.fire({
              icon: "error",
              text: "Ocorreu um erro ao tentar excluir local.",
            });
          }
        } else if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para cadastrar um novo item!",
          }).then(({ value }) => {
            if (value === true) {
              router.push("/TelaLogin");
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            text: `Ocorreu um erro ao tentar fazer exclusão.\nCódigo do erro: ${error.response?.status}`,
          });
        }
        console.error(error);
      });
  };

  useEffect(() => {
    // Obtendo todos os locais
    axios
      .get("/local")
      .then((response) => {
        if (response.status == 200) {
          setLocalizacoes(response.data.locations);
        }
      })
      .catch((error: AxiosError) => {
        if (error.response?.status == 403) {
          Swal.fire({
            icon: "error",
            text: "Faça login para acessar localizações!",
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
  }, [showCreate, showEditDelete, selectedLocal]);

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.estiloCadastro}>
          <p>Gerenciar Localizações</p>
        </div>
        <div className={styles.botoes}>
          <button
            className={`${styles.EstilobotaoMenu} ${
              showCreate ? styles.buttonSelected : styles.buttonUnselected
            }`}
            onClick={telaCriacaoClicada}
          >
            Cadastrar Local
          </button>
          <button
            className={`${styles.EstilobotaoMenu} ${
              showEditDelete ? styles.buttonSelected : styles.buttonUnselected
            }`}
            onClick={telaEdicaoClicada}
          >
            Editar/Excluir Local
          </button>
        </div>
        {showCreate && (
          <div>
            <div className={styles.containerPrincipal}>
              <div className={styles.inputContainer2}>
                <p className={styles.Nomes}>Bloco</p>
                <input
                  type="text"
                  id="bloco"
                  name="bloco"
                  value={formData.bloco}
                  placeholder="Digite o bloco do local (Ex: Bloco - 910)"
                  className={styles.input}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Sala</p>
                  <input
                    type="text"
                    id="sala"
                    name="sala"
                    value={formData.sala}
                    placeholder="Digite a sala do local"
                    className={styles.input}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className={styles.botoesInferiores} onClick={cadastrarLocal}>
              <p className={styles.estiloBotao}>Criar Local</p>
            </div>
          </div>
        )}
        {showEditDelete && (
          <div className={styles.conteudo}>
            <div className={styles.containerBuscar}>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Selecione um local</p>
                  <Select
                    value={selectedLocal}
                    onChange={(selectedOption) =>
                      setSelectedLocal(selectedOption as Local)
                    }
                    options={localizacoes.map((localizacao) => ({
                      label: `${localizacao.departmentBuilding} - ${localizacao.room}`,
                      value: localizacao.id,
                      departmentBuilding: localizacao.departmentBuilding,
                      room: localizacao.room,
                      id: localizacao.id,
                    }))}
                    isSearchable
                    placeholder="Digite ou selecione um local"
                    noOptionsMessage={() => "Nenhuma opção disponível"}
                  />
                </div>
              </div>
            </div>
            <div className={styles.containerPrincipal}>
              <div className={styles.inputContainer}>
                <p className={styles.Nomes}>Bloco</p>
                <input
                  type="text"
                  id="departamentoEdicao"
                  name="departamentoEdicao"
                  placeholder="Departamento"
                  value={selectedLocal?.departmentBuilding || ""}
                  onChange={(e) =>
                    setSelectedLocal((prev) => ({
                      ...prev,
                      departmentBuilding: e.target.value,
                      id: prev?.id || 0,
                      room: prev?.room || "",
                    }))
                  }
                  className={styles.input}
                />
              </div>
              <div className={styles.divisao}>
                <div className={styles.inputContainer}>
                  <p className={styles.Nomes}>Sala</p>
                  <input
                    type="text"
                    id="salaEdicao"
                    name="salaEdicao"
                    placeholder="Sala"
                    value={selectedLocal?.room || ""}
                    onChange={(e) =>
                      setSelectedLocal((prev) => ({
                        ...prev,
                        departmentBuilding: prev?.departmentBuilding || "",
                        id: prev?.id || 0,
                        room: e.target.value,
                      }))
                    }
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
            <div className={styles.botoesInferiores}>
              <p className={styles.estiloBotao} onClick={editarLocal}>
                Salvar Alterações
              </p>
              <p className={styles.estiloBotaoExcluir} onClick={excluirLocal}>
                Excluir Local
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditarLocal;
