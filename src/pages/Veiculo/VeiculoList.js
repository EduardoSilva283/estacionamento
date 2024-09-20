import { View, Text, SafeAreaView, Keyboard, FlatList } from 'react-native';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Icon, ListItem } from "react-native-elements";
import styles from './styles.js';
import { API_URL } from '../../constants/endpoints.js';

export default VeiculoList => {
    // Variáveis de estado para veículos e proprietários
    const [veiculos, setVeiculos] = useState([]);
    const [proprietarios, setProprietarios] = useState([]); // Lista de proprietários

    // Função que deleta um veículo utilizando a API
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://192.168.3.211:8081/veiculo/${id}`);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    // Função que lista todos os veículos da API
    const fetchAllVeiculos = async () => {
        try {
            const res = await axios.get("http://192.168.3.211:8081/veiculo");
            setVeiculos(res.data);
            Keyboard.dismiss();
        } catch (err) {
            console.log(err);
        }
    };

    // Função que lista todos os proprietários da API
    const fetchAllProprietarios = async () => {
        try {
            const res = await axios.get("http://192.168.3.211:8081/proprietario");
            setProprietarios(res.data); // Armazena a lista de proprietários
        } catch (err) {
            console.log(err);
        }
    };

    // Carregar dados de veículos e proprietários ao abrir a tela
    useEffect(() => {
        fetchAllVeiculos();
        fetchAllProprietarios();
    }, []);

    // Função que mapeia o ID do proprietário ao nome correspondente
    const getNomeProprietario = (idProprietario) => {
        const proprietario = proprietarios.find(p => p.id_proprietario === idProprietario);
        return proprietario ? proprietario.nome : "Desconhecido";
    };

    // Função para criar os botões Deletar e Editar na listagem
    function getActions(data) {
        return (
            <>
                <Button
                    onPress={() =>
                        VeiculoList.navigation.navigate('VeiculoEdit', data)}
                    type="clear"
                    icon={<Icon name="edit" size={25} color="orange" />}
                />
                <Button
                    onPress={() => handleDelete(data.id_veiculo)}
                    type="clear"
                    icon={<Icon name="delete" size={25} color="red" />}
                />
            </>
        );
    }

    // Função que preenche a lista e joga no FlatList
    function Listagem({ data }) {
        return (
            <ListItem bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>Placa: {data.placa}</ListItem.Title>
                    <ListItem.Subtitle>Ano: {data.ano}</ListItem.Subtitle>
                    <ListItem.Subtitle>Proprietário: {getNomeProprietario(data.fk_proprietario)}</ListItem.Subtitle>
                    <ListItem.Subtitle>Mensalidade: R$ {data.mensalidade}</ListItem.Subtitle>
                </ListItem.Content>
                {getActions(data)}
            </ListItem>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignItems: "center" }}>
                <Text style={styles.text}>Listando os Dados</Text>
            </View>
            <FlatList
                keyExtractor={item => item.id_veiculo.toString()}
                data={veiculos}
                renderItem={({ item }) => (<Listagem data={item} />)}
            />
        </SafeAreaView>
    );
};
