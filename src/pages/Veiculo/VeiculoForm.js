import { View, Text, SafeAreaView, TextInput, Pressable, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Picker } from '@react-native-picker/picker'; // Importa o Picker
import styles from './styles.js';

export default function VeiculoForm() {
    // Variáveis state para os campos do formulário
    const [placa, setPlaca] = useState("");
    const [ano, setAno] = useState("");
    const [mensalidade, setMensalidade] = useState("");
    const [fk_proprietario, setFk_proprietario] = useState("");
    const [proprietarios, setProprietarios] = useState([]); // Lista de proprietários para o Picker

    // Função para buscar os proprietários da API
    useEffect(() => {
        const fetchProprietarios = async () => {
            try {
                const response = await axios.get("http://192.168.3.211:8081/proprietario");
                setProprietarios(response.data); // Armazena a lista de proprietários no estado
            } catch (error) {
                Alert.alert("Erro", "Não foi possível carregar os proprietários.");
                console.error(error);
            }
        };

        fetchProprietarios(); // Chama a função quando o componente é montado
    }, []);

    // Função que cadastra os dados utilizando a API
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://192.168.3.211:8081/veiculo", {
                placa: placa,
                ano: ano,
                mensalidade: mensalidade,
                fk_proprietario: fk_proprietario, // Envia o proprietário selecionado
            });
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignItems: "center" }}>
                <Text style={styles.text}>Placa</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Placa"
                    value={placa}
                    onChangeText={(texto) => setPlaca(texto)}
                />
                <Text style={styles.text}>Ano</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ano"
                    value={ano}
                    onChangeText={(texto) => setAno(texto)}
                />
                <Text style={styles.text}>Mensalidade</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Mensalidade"
                    value={mensalidade}
                    onChangeText={(texto) => setMensalidade(texto)}
                />

                <Text style={styles.text}>Proprietário</Text>
                <Picker
                    selectedValue={fk_proprietario}
                    style={styles.input}
                    onValueChange={(itemValue, itemIndex) => setFk_proprietario(itemValue)}
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
            </View>
            <View style={styles.areaBtn}>
                <Pressable
                    style={[styles.botao, { backgroundColor: "#1d75cd" }]}
                    onPress={handleClick}
                >
                    <Text style={styles.botaoText}>Cadastrar</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};
