"use client";
import { useState } from "react";
import styles from "./page.module.css";
import image from "/public/Computer login-rafiki (1).png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { axios } from '@/config/axios';
import { AxiosResponse, AxiosError } from 'axios';

interface FormData {
    password: string;
    passwordConfirmation: string;
}

interface FormPassword {
  equals: boolean;
}

function TelaAlteracaoSenha() {
  const [formData, setFormData] = useState<FormData>({
    password: "",
    passwordConfirmation: ""
  });
  const [formPassword, setFormPassword] = useState<FormPassword>({
    equals: false
  });  
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lógica para lidar com a mudança nos campos de entrada
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Verificando se as senhas são iguais
    const inputPass = document.getElementsByName(name)[0] as HTMLInputElement;
    const inputPassConfirm = document.getElementsByName(name == "password" ? 'passwordConfirmation' : "password")[0] as HTMLInputElement;
    const sinalizador = document.getElementById('sinalizadorSenhasDiferentes');
    if (inputPass.value.length == 0 || inputPass.value != inputPassConfirm.value) {
      if (sinalizador) {
        sinalizador.style.display = 'block';
      }
      setFormPassword({equals: false});
    } else {
      if (sinalizador) {
        sinalizador.style.display = 'none';
      }
      setFormPassword({equals: true});
    }
  }

  const validateData = (password: String, passwordConfirmation: String) => {
    if (password == '' || passwordConfirmation == '') {
      return false;
    }
    return true;
  }

  const handleAlterarSenha = (): void => {
    const dataIsValid = validateData(formData.password, formData.passwordConfirmation);
    if (!dataIsValid) {
      Swal.fire({
        icon: 'warning',
        text: 'Informe e confirme a nova senha!'
      });
      return;
    }
    axios.post('/redefine-password', { password: formData.password })
    .then((response: AxiosResponse) => {
      if (response.status == 200) {
        Swal.fire({
          icon: 'info',
          text: 'Senha atualizada com sucesso!'
        }).then(({value}) => {
          if (value === true) {
            router.push('/TelaLogin');
          }
        });
      }
    }).catch((error: AxiosError) => {
      Swal.fire({
        icon: 'error',
        text: `Ocorreu um erro ao tentar alterar a senha.\nCódigo do erro: ${error.response?.status}`
      });
      router.push('/TelaLogin');
      console.error(error);
    });
  };

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.imagemContainer}>
          <Image
            src={image}
            className={styles.image}
            objectFit="cover"
            fill
            alt="Imagem de Exemplo Login"
          />
        </div>
        <div className={styles.containerEntrada}>
          <h2 className={styles.titulo}>Alterar Senha</h2>
          <p className={styles.estilosubtitulo}>
            Informe a nova senha.
          </p>
          <form className={styles.dadosEntrada}>
            <p className={styles.nomes}>Nova Senha</p>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              placeholder="Digite a nova senha"
              onChange={handleInputChange}
              className={styles.input}
              tabIndex={0}
              required
            />
            <p className={styles.nomes}>Confirme Nova Senha</p>
            <input
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              placeholder="Digite a nova senha"
              onChange={handleInputChange}
              className={styles.input}
              tabIndex={0}
              required
            />
            <p id={'sinalizadorSenhasDiferentes'} className={styles.sinalizadorSenhasDiferentes}>As senhas não correspondem!</p><br></br>
          </form>
          <div id={'btnAlterar'}className={styles.estiloBotao} onClick={formPassword.equals ? handleAlterarSenha : ()=>{}} tabIndex={0}>Alterar Senha</div>
        </div>
      </div>
    </div>
  );
}

export default TelaAlteracaoSenha;