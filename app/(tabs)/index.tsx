import estadosCidadesData from "@/assets/data/estados-cidades.json";
import { ThemedText } from "@/components/themed-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const vehicleData = [
  {
    type: "I",
    name: "Carro",
    img: require("@/assets/images/veiculos/i2/de-passeio.png"),
  },
  {
    type: "J",
    name: "Motocicleta",
    img: require("@/assets/images/veiculos/j2/motocicleta.png"),
  },
  {
    type: "A",
    name: "Caminhão ou ônibus de 2 eixos",
    img: require("@/assets/images/veiculos/A.png"),
  },
  {
    type: "B",
    name: "Caminhão ou ônibus de 3 eixos",
    img: require("@/assets/images/veiculos/B.png"),
  },
  {
    type: "C",
    name: "Caminhão ou ônibus de 4 eixos",
    img: require("@/assets/images/veiculos/C.png"),
  },
  {
    type: "D",
    name: "Caminhão ou ônibus de 5 eixos",
    img: require("@/assets/images/veiculos/D.png"),
  },
  {
    type: "E",
    name: "Caminhão ou ônibus de 6 eixos",
    img: require("@/assets/images/veiculos/E.png"),
  },
  {
    type: "F",
    name: "Caminhão ou ônibus de 7 eixos",
    img: require("@/assets/images/veiculos/F.png"),
  },
  {
    type: "G",
    name: "Caminhão ou ônibus de 8 eixos",
    img: require("@/assets/images/veiculos/G.png"),
  },
  {
    type: "H",
    name: "Caminhão ou ônibus de 9 eixos",
    img: require("@/assets/images/veiculos/H.png"),
  },
  {
    type: "L",
    name: "Indeterminado",
    img: require("@/assets/images/partial-react-logo.png"),
  },
];

type Estado = {
  sigla: string;
  nome: string;
  cidades: string[];
};

type Registro = {
  ufOrigem: string;
  cidadeOrigem: string;
  ufDestino: string;
  cidadeDestino: string;
  veiculo: string;
  data: string;
};

export default function HomeScreen() {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [ufOrigem, setUfOrigem] = useState("");
  const [ufDestino, setUfDestino] = useState("");

  const [cidadesOrigem, setCidadesOrigem] = useState<string[]>([]);
  const [cidadeOrigem, setCidadeOrigem] = useState("");
  const [cidadesDestino, setCidadesDestino] = useState<string[]>([]);
  const [cidadeDestino, setCidadeDestino] = useState("");

  const [veiculo, setVeiculo] = useState("");
  const [registros, setRegistros] = useState<Registro[]>([]);

  useEffect(() => {
    setEstados(estadosCidadesData.estados);

    const loadRegistros = async () => {
      try {
        const saved = await AsyncStorage.getItem("registros");
        if (saved) {
          setRegistros(JSON.parse(saved));
        } else {
          setRegistros([]);
        }
      } catch (e) {
        Alert.alert("Erro ao carregar registros");
      }
    };
    loadRegistros();
  }, []);

  useEffect(() => {
    if (ufOrigem) {
      const estado = estados.find((e) => e.sigla === ufOrigem);
      setCidadesOrigem(estado ? estado.cidades : []);
    } else {
      setCidadesOrigem([]);
    }
  }, [ufOrigem, estados]);

  useEffect(() => {
    if (ufDestino) {
      const estado = estados.find((e) => e.sigla === ufDestino);
      setCidadesDestino(estado ? estado.cidades : []);
    } else {
      setCidadesDestino([]);
    }
  }, [ufDestino, estados]);

  const salvarRegistro = async (novoRegistro: Registro) => {
    try {
      const novosRegistros = [...registros, novoRegistro];
      await AsyncStorage.setItem("registros", JSON.stringify(novosRegistros));
      setRegistros(novosRegistros);
      setUfOrigem("");
      setUfDestino("");
      setCidadesOrigem([]);
      setCidadeOrigem("");
      setCidadesDestino([]);
      setCidadeDestino("");
      setVeiculo("");
    } catch (e) {
      Alert.alert("Erro ao salvar registro");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fdfdfd" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Vindo de */}
        <ThemedText style={styles.sectionTitle}>Vindo de</ThemedText>
        <Picker
          selectedValue={ufOrigem}
          onValueChange={setUfOrigem}
          style={styles.picker}
        >
          <Picker.Item label="Selecione a UF" value="" />
          {estados.map((estado) => (
            <Picker.Item
              key={estado.sigla}
              label={`${estado.sigla} - ${estado.nome}`}
              value={estado.sigla}
            />
          ))}
        </Picker>
        {cidadesOrigem.length > 0 && (
          <Picker
            selectedValue={cidadeOrigem}
            onValueChange={setCidadeOrigem}
            style={styles.picker}
          >
            <Picker.Item label="Selecione a cidade" value="" />
            {cidadesOrigem.map((cidade) => (
              <Picker.Item key={cidade} label={cidade} value={cidade} />
            ))}
          </Picker>
        )}

        {/* Indo para */}
        <ThemedText style={styles.sectionTitle}>Indo para</ThemedText>
        <Picker
          selectedValue={ufDestino}
          onValueChange={setUfDestino}
          style={styles.picker}
        >
          <Picker.Item label="Selecione a UF" value="" />
          {estados.map((estado) => (
            <Picker.Item
              key={estado.sigla}
              label={`${estado.sigla} - ${estado.nome}`}
              value={estado.sigla}
            />
          ))}
        </Picker>
        {cidadesDestino.length > 0 && (
          <Picker
            selectedValue={cidadeDestino}
            onValueChange={setCidadeDestino}
            style={styles.picker}
          >
            <Picker.Item label="Selecione a cidade" value="" />
            {cidadesDestino.map((cidade) => (
              <Picker.Item key={cidade} label={cidade} value={cidade} />
            ))}
          </Picker>
        )}

        {/* Tipo de veículo */}
        <ThemedText style={styles.sectionTitle}>Tipo de veículo</ThemedText>
        <View style={styles.radioGroup}>
          {vehicleData.map((v) => (
            <TouchableOpacity
              key={v.type}
              onPress={() => setVeiculo(v.type)}
              style={styles.radioItem}
            >
              <Image source={v.img} style={styles.icon} />
              <ThemedText
                style={
                  veiculo === v.type
                    ? styles.vehicleSelected
                    : styles.vehicleText
                }
              >
                {v.name}
              </ThemedText>
            </TouchableOpacity>
          ))}

          {ufOrigem && cidadeOrigem && ufDestino && cidadeDestino && veiculo ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                salvarRegistro({
                  ufOrigem,
                  cidadeOrigem,
                  ufDestino,
                  cidadeDestino,
                  veiculo,
                  data: new Date().toISOString(),
                })
              }
            >
              <ThemedText style={styles.buttonText}>Salvar</ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedText style={styles.warningText}>
              Preencha o formulário inteiro.
            </ThemedText>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  picker: {
    backgroundColor: "#f6f6f6",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  radioGroup: {
    flexDirection: "column",
    gap: 24,
  },
  radioItem: {
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    width: 300,
    height: 100,
    resizeMode: "contain",
    marginBottom: 8,
  },
  vehicleText: {
    fontSize: 16,
    color: "#555",
  },
  vehicleSelected: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000000",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  warningText: {
    color: "#E53935",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "500",
  },
});
