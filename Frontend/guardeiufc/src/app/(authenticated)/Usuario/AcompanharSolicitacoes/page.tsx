"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Table from "react-bootstrap/Table";
import { FaFilePdf } from "react-icons/fa6";
import { axios } from '@/config/axios';
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface ReportRequest {
  requestedBy: string;
  answeredBy: string;
  description: string;
  motiveOfRequest: string;
  solicitedAt: string;
  answeredAt: string;
  status: string;
  motiveOfIndefer: string;
  filePath: string;
}

interface Response {
  filteredReportReq: ReportRequest[];
}

export default function AcompanharSolicitacoes() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('');
  const [visualizar, setVisualizar] = useState(false);
  const [selectedRequestStatus, setSelectedRequestStatus] = useState('');
  const [formState, setFormState] = useState({
    matricula: "",
    matriculaRespondente: "",
    motivoS: "",
    descricaoR: "",
    dataResposta: "",
    motivoI: "",
    status: "",
    nomeArquivo: ""
  });
  const [dados, setDados] = useState<ReportRequest[]>([
    {
      requestedBy: "",
      answeredBy: "",
      description: "",
      motiveOfRequest: "",
      solicitedAt: "",
      answeredAt: "",
      status: "",
      motiveOfIndefer: "",
      filePath: ""
    }
  ]);

  const formatDate = (date: string) => {
    var date_ = new Date(date);
    return ((date_.getDate() )) + "/" + ((date_.getMonth() + 1)) + "/" + date_.getFullYear();
  }

  const handleGetRequestByStatus = (status: string) => {
    setSelectedOption(status);

    axios.get<Response>(process.env.NEXT_PUBLIC_BASE_URL + `/report-request/${status}`)
    .then(response => {
      if (response.status == 200) {
        setDados(response.data.filteredReportReq);
      }
    }).catch((error: AxiosError) => {
      if (error.response?.status == 403) {
        Swal.fire({
          icon: 'error',
          text: 'Faça login para visualizar suas solicitações de relatório!'
        }).then(() => {
          router.push('/TelaLogin');
        });
      } else {      
        Swal.fire({
          icon: 'error',
          text: `Ocorreu um erro ao tentar buscar as solicitações. Por favor, tente novamente!\nCódigo do erro: ${error.response?.status}`
        });
      }
      console.error(error);
    });
  };

  const handleVisualizar = (row: ReportRequest) => {
    // Define o estado do formulário com os dados da linha clicada
    setFormState({
      matricula: row.requestedBy,
      matriculaRespondente: row.answeredBy,
      motivoS: row.motiveOfRequest,
      descricaoR: row.description,
      dataResposta: formatDate(row.answeredAt),
      motivoI: row.motiveOfIndefer,
      status: row.status,
      nomeArquivo: row.filePath
    });
    setSelectedRequestStatus(row.status);
    setVisualizar(true);
  };

  const handleAction = (row: ReportRequest) => {
    // TODO
    // Abre os contêineres do formulário
    handleVisualizar(row);
  };

  const handleDownloadPDFReport = (filename: string) => {
    // TODO
    alert(`Enviar requisição para baixar arquivo com nome ${filename}`);
  }

  useEffect(() => {
    setSelectedOption('Todas');
    handleGetRequestByStatus('Todas');
  }, []);

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.Principal}>
          <p className={styles.estilotitulo}>
            Acompanhar Solicitações de Relatórios
          </p>
          <p className={styles.estilosubtitulo}>
            Veja abaixo os relatórios que você solicitou e filtre pelo status da solicitação.
          </p>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="Pendente"
                checked={selectedOption == 'Pendente'}
                onChange={() => { handleGetRequestByStatus('Pendente') }}
              />
              Pendentes
            </label>
            <label>
              <input
                type="radio"
                value="Deferida"
                checked={selectedOption == 'Deferida'}
                onChange={() => { handleGetRequestByStatus('Deferida') }}
              />
              Deferidas
            </label>
            <label>
              <input
                type="radio"
                value="Indeferida"
                checked={selectedOption == 'Indeferida'}
                onChange={() => { handleGetRequestByStatus('Indeferida') }}
              />
              Indeferidas
            </label>
            <label>
              <input
                type="radio"
                value="Todas"
                checked={selectedOption == 'Todas'}
                onChange={() => { handleGetRequestByStatus('Todas') }}
              />
              Todas
            </label>
          </div>
          <div className={styles.tabela}>
            <div className="table-responsive" style={{ overflowX: "auto" }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Solicitante</th>
                    <th>Descrição do Relatório</th>
                    <th>Motivo da Solicitação</th>
                    <th>Data Solicitação</th>
                    <th>Status</th>
                    <th>Motivo indeferimento</th>
                    <th>Acão</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((row, index) => (
                    <tr key={index}>
                      <td>{row.requestedBy}</td>
                      <td>{row.description}</td>
                      <td>{row.motiveOfRequest}</td>
                      <td>{formatDate(row.solicitedAt)}</td>
                      <td>{row.status}</td>
                      <td>{row.motiveOfIndefer}</td>
                      <td>
                        <button onClick={() => handleAction(row)}>
                          Visualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
          {visualizar && (
            <div className={styles.ContainerPrincipalDescricao}>
              <div className={styles.containerDescricao}>
                <div className={styles.divisao}>
                  <div className={styles.inputContainer1}>
                    <p className={styles.Nomes}>Matrícula Solicitante</p>
                    <input
                      type="text"
                      id="matricula"
                      name="matricula"
                      className={styles.input}
                      readOnly
                      value={formState.matricula}
                    />
                  </div>
                </div>
                <p className={styles.Nomes}>Motivo da solicitação</p>
                <textarea
                  id="motivoS"
                  name="motivoS"
                  className={styles.textarea}
                  value={formState.motivoS}
                  readOnly
                />
                <p className={styles.Nomes}>Descrição do relatório</p>
                <textarea
                  id="descricaoR"
                  name="descricaoR"
                  className={styles.textarea}
                  value={formState.descricaoR}
                  readOnly
                />
                { selectedRequestStatus != 'Pendente' && (
                  <div className={styles.inputContainer1}>
                    <div className={styles.verticalContainer}>
                      <div className={styles.horizontalContainer}>
                        <p className={styles.Nomes}>Matrícula Respondente</p>
                        <input
                          type="text"
                          id="matriculaRespondente"
                          name="matriculaRespondente"
                          className={styles.input}
                          readOnly
                          value={formState.matriculaRespondente}
                        />
                      </div>
                      <div className={styles.horizontalContainer}>
                        <p className={styles.Nomes}>Data Resposta</p>
                        <input
                          type="text"
                          id="dataResposta"
                          name="dataResposta"
                          className={styles.input}
                          readOnly
                          value={formState.dataResposta}
                        />
                      </div>
                    </div>
                  </div>                  
                )}
                { selectedRequestStatus == 'Indeferida' && (
                <div className={'areaIndeferimento'}>
                  <p className={styles.Nomes}>Motivo do indeferimento</p>
                  <textarea
                    id="motivoI"
                    name="motivoI"
                    className={styles.textarea}
                    value={formState.motivoI}
                    readOnly
                  />
                </div>
                )}
                { selectedRequestStatus == 'Deferida' && (
                <div className={styles.areaDeferimento}>
                  <FaFilePdf className={styles.downloadIcon} onClick={() => handleDownloadPDFReport('Nome do relatório.pdf')}/>
                  <p onClick={() => handleDownloadPDFReport('Nome do relatório.pdf')}> Baixar relatório</p>
                </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
