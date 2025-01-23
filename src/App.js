import React, { useEffect, useState } from "react";
import "./styles.css";

/**
 * # Desafio front-end
 *
 * # Nome: Franco Baisch
 *
 * É um componente que terá um select e um botão, e terá
 * uma listagem ou grid com dados logo abaixo.
 *
 * O componente deve ser montado inicialmente com um
 * placeholder.
 *
 * Deve então fazer um fetch na API para buscar a lista
 * de todos os estados do Brasil.
 *
 * Depois, listar no elemento do tipo select todos estes
 * estados como opções.
 *
 * Quando o usuário selecionar um estado, o botão fica ativo.
 *
 * Se o usuário clicar no botão, deve então buscar a lista
 * de cidades naquele estado.
 *
 * Quando obtiver o resultado, deve listar as cidades daquele
 * estado exibindo o nome da cidade, e o nome da microrregião
 * daquela cidade.
 *
 * # Bonus points
 * - Colocar tanto os estados quanto as cidades em ordem
 *   alfabética
 * - Se o dispositivo for pequeno (mobile), este grid pode
 *   mostrar apenas o nome da cidade.
 *
 * # Helpers
 * API para pegar a lista de estados do Brasil:
 * https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome
 *
 * API para pegar a lista de cidades em um determinado estado:
 * https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/distritos
 *
 */

export default function App() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [cities, setCities] = useState([]);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isPlaceholderDisabled, setIsPlaceholderDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
    )
      .then(async (response) => {
        const apiData = await response.json();
        setStates(apiData);
      })
      .catch((error) => console.log(error));
  }, []);

  const createDropdownOptions = (states) => {
    const options = [
      <option key="placeholder" value="" disabled={isPlaceholderDisabled}>
        Selecione um estado
      </option>,
      ...states.map((estado) => (
        <option key={estado.id} value={estado.sigla}>
          {estado.nome}
        </option>
      )),
    ];

    return options;
  };

  const handleStateSelection = (value) => {
    setIsButtonActive(true);
    setIsPlaceholderDisabled(true);
    setSelectedState(value);
  };

  const searchStateCities = async (uf) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`
      );
      const cityData = await response.json();

      const sortedCities = cityData.sort((a, b) =>
        a.nome.localeCompare(b.nome)
      );

      setCities(sortedCities);
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar cidades:", error);
    }
  };

  return (
    <div className="App">
      <div className="header">
        <select
          className="select"
          name="estados"
          onChange={(e) => handleStateSelection(e.target.value)}
        >
          {createDropdownOptions(states)}
        </select>
        <button
          className="btn"
          disabled={!isButtonActive}
          onClick={() => searchStateCities(selectedState)}
        >
          Ok
        </button>
      </div>
      <div className="main">
        {isLoading ? (
          <p>Carregando cidades...</p>
        ) : (
          cities.length > 0 && (
            <ul>
              {cities.map((city) => (
                <li key={city.id}>
                  <strong>Cidade:</strong> {city.nome}{" "}
                  <span>
                    <strong>Microrregião:</strong>{" "}
                    {city.municipio.microrregiao.nome}
                  </span>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}
