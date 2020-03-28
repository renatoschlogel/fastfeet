import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { MdAdd, MdEdit, MdDeleteForever } from 'react-icons/md';

import { Container, DeliverymanField, Avatar, LetterAvatar } from './styles';

import { PageTitle } from '~/styles/PageTittle';

import SearchInput from '~/components/SearchInput';
import Actions from '~/components/Actions';
import Table from '~/components/Table';

import api from '~/services/api';

import { createLetterAvatar } from '~/util/letterAvatar';

export default function Deliverymen() {
  const [deliverymen, setDeliverymen] = useState([]);

  const parseDeliverymen = useCallback((data) => {
    return data.map((deliveryman, index) => {
      deliveryman.idText =
        deliveryman.id > 9 ? `#${deliveryman.id}` : `#0${deliveryman.id}`;

      deliveryman.letterAvatar = createLetterAvatar(deliveryman.name, index);

      return deliveryman;
    });
  }, []);

  const handleSearch = async (search) => {
    const response = await api.get(`deliverymen?q=${search}`);
    const data = parseDeliverymen(response.data);
    setDeliverymen(data);
  };

  const handleEdit = useCallback((deliveryman) => {
    console.tron.log(deliveryman);
  }, []);

  const handleDelete = useCallback(
    async (deliveryman) => {
      // eslint-disable-next-line no-alert
      const gonnaDelete = window.confirm(
        `Tem certeza que deseja excluir o entregador ${deliveryman.idText}?`
      );

      if (!gonnaDelete) return;

      await api.delete(`deliverymen/${deliveryman.id}`);
      toast.info(`O entregador ${deliveryman.idText} foi excluído!`);
      setDeliverymen(deliverymen.filter(({ id }) => id !== deliveryman.id));
    },
    [deliverymen]
  );

  useEffect(() => {
    async function getDeliverymen() {
      const response = await api.get('deliverymen');
      const data = parseDeliverymen(response.data);
      setDeliverymen(data);
    }

    getDeliverymen();
  }, [parseDeliverymen]);

  return (
    <Container>
      <header>
        <PageTitle>Gerenciando entregadores</PageTitle>
      </header>
      <div>
        <SearchInput
          placeholder="Buscar por entregador"
          callback={handleSearch}
        />
        <Link to="/">
          <MdAdd color="#FFFFFF" size={26} />
          Cadastrar
        </Link>
      </div>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Foto</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {deliverymen.map((deliveryman) => (
            <tr key={String(deliveryman.id)}>
              <td>{deliveryman.idText}</td>

              <DeliverymanField>
                {deliveryman.avatar ? (
                  <Avatar src={deliveryman.avatar.url} />
                ) : (
                  <LetterAvatar color={deliveryman.letterAvatar.color}>
                    {deliveryman.letterAvatar.letters}
                  </LetterAvatar>
                )}
              </DeliverymanField>
              <td>{deliveryman.name}</td>
              <td>{deliveryman.email}</td>
              <td>
                <Actions>
                  <button type="button" onClick={() => handleEdit(deliveryman)}>
                    <MdEdit size={24} color="#4D85EE" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(deliveryman)}
                  >
                    <MdDeleteForever size={24} color="#DE3B3B" />
                    Excluir
                  </button>
                </Actions>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
