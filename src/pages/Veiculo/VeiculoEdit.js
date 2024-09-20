import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, SafeAreaView, Pressable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import styles from './styles.js';

export default ({ route, navigation }) => {
    // Variável que recebe os dados da Lista e preenche os campos do form
    const [veiculos, setVeiculos] = useState(route.params ? route.params : {});
    const [proprietarios, setProprietarios] = useState([]); // Lista de proprietários
    const [selectedProprietario, setSelectedProprietario] = useState(veiculos.fk_proprietario || "");


    // Função que busca os proprietários da API
    useEffect(() => {
        const fetchProprietarios = async () => {
            try {
                const response = await axios.get('http://192.168.3.211:8081/proprietario');
                setProprietarios(response.data); // Armazena os proprietários retornados
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível carregar os proprietários.');
                console.error(error);
            }
        };

        fetchProprietarios();
    }, []);

    // Função que altera os dados utilizando a API
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://192.168.3.211:8081/veiculo/${veiculos.id_veiculo}`, {
                ...veiculos,
                fk_proprietario: selectedProprietario // Atualiza o proprietário no estado
            });
            navigation.goBack();
            window.location.reload(); // Força recarregamento (opcional)
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignItems: "center" }}>
                <Text style={styles.text}>Identificação</Text>
                <TextInput
                    readOnly
                    style={styles.input}
                    onChangeText={id_veiculo => setVeiculos({
                        ...veiculos, id_veiculo
                    })}
                    value={veiculos.id_veiculo}
                />
                <Text style={styles.text}>Digite a Placa</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={placa => setVeiculos({
                        ...veiculos, placa
                    })}
                    value={veiculos.placa}
                />
                <Text style={styles.text}>Ano</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={ano => setVeiculos({
                        ...veiculos, ano
                    })}
                    value={veiculos.ano}
                />
                <Text style={styles.text}>Mensalidade</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={mensalidade => setVeiculos({
                        ...veiculos, mensalidade
                    })}
                    value={veiculos.mensalidade}
                />

                <Text style={styles.text}>Proprietário</Text>
                <Picker
                    selectedValue={selectedProprietario}
                    style={styles.input}
                    onValueChange={(itemValue, itemIndex) => setSelectedProprietario(itemValue)}
                >
                    <Picker.Item label="Selecione o proprietário" value="" />
                    {proprietarios.map((proprietario) => (
                        <Picker.Item
                            key={proprietario.id_proprietario}
                            label={proprietario.nome}
                            value={proprietario.id_proprietario}
                        />
                    ))}
                </Picker>

                <Pressable
                    style={[styles.botao, { backgroundColor: "#1d75cd" }]}
                    onPress={handleClick}
                >
                    <Text style={styles.botaoText}>Alterar</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};
