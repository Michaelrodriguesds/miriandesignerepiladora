import React, { useEffect, useState } from 'react';
import './Procedures.css'; // Importando o CSS

const Procedures = () => {
  const [procedures, setProcedures] = useState([]);

  useEffect(() => {
    const fetchProcedures = async () => {
      const response = await fetch('https://backende-deploy.onrender.com/api/public/procedures');
      const data = await response.json();
      setProcedures(data);
    };

    fetchProcedures();
  }, []);

  return (
    <div id="procedures" className="procedures-container">
      <h2>Tabela de Preços</h2>
      <table className="procedures-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Preço</th>
          </tr>
        </thead>
        <tbody>
          {procedures.map((procedure) => (
            <tr key={procedure._id}>
              <td>{procedure.description}</td>
              <td>R$ {procedure.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Procedures;
