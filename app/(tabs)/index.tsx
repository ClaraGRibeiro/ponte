import estadosCidadesData from "@/assets/data/estados-cidades.json";
import { ThemedText } from "@/components/themed-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";

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
  const [msg, setMsg] = useState<string>("");
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
        setRegistros(saved ? JSON.parse(saved) : []);
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
      Toast.show({
        type: "success",
        text1: "Registro salvo ✅",
        position: "top",
        visibilityTime: 2000,
      });
      setUfOrigem("");
      setUfDestino("");
      setCidadesOrigem([]);
      setCidadeOrigem("");
      setCidadesDestino([]);
      setCidadeDestino("");
      setVeiculo("");
    } catch (e) {      
      Toast.show({
        type: "error",
        text1: "Erro ao salvar registro ❌",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fdfdfd" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Vindo de */}
        <ThemedText style={styles.sectionTitle}>Vindo de</ThemedText>
        <Dropdown
          style={styles.dropdown}
          data={estados.map((estado) => ({
            label: `${estado.sigla} - ${estado.nome}`,
            value: estado.sigla,
          }))}
          search
          labelField="label"
          valueField="value"
          placeholder="Selecione a UF"
          searchPlaceholder="Buscar UF..."
          value={ufOrigem}
          onChange={(item) => setUfOrigem(item.value)}
        />

        {cidadesOrigem.length > 0 && (
          <Dropdown
            style={styles.dropdown}
            data={cidadesOrigem.map((cidade) => ({
              label: cidade,
              value: cidade,
            }))}
            search
            labelField="label"
            valueField="value"
            placeholder="Selecione a cidade"
            searchPlaceholder="Buscar cidade..."
            value={cidadeOrigem}
            onChange={(item) => setCidadeOrigem(item.value)}
          />
        )}

        {/* Indo para */}
        <ThemedText style={styles.sectionTitle}>Indo para</ThemedText>
        <Dropdown
          style={styles.dropdown}
          data={estados.map((estado) => ({
            label: `${estado.sigla} - ${estado.nome}`,
            value: estado.sigla,
          }))}
          search
          labelField="label"
          valueField="value"
          placeholder="Selecione a UF"
          searchPlaceholder="Buscar UF..."
          value={ufDestino}
          onChange={(item) => setUfDestino(item.value)}
        />

        {cidadesDestino.length > 0 && (
          <Dropdown
            style={styles.dropdown}
            data={cidadesDestino.map((cidade) => ({
              label: cidade,
              value: cidade,
            }))}
            search
            labelField="label"
            valueField="value"
            placeholder="Selecione a cidade"
            searchPlaceholder="Buscar cidade..."
            value={cidadeDestino}
            onChange={(item) => setCidadeDestino(item.value)}
          />
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
            <ThemedText style={styles.warningText}>{msg}</ThemedText>
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
  dropdown: {
    backgroundColor: "#f6f6f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 50,
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
    color: "#4CAF50",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "500",
  },
});
