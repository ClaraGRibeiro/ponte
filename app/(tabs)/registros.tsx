import registrosJSON from "@/assets/data/registros.json";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

type Registro = {
  ufOrigem: string;
  cidadeOrigem: string;
  ufDestino: string;
  cidadeDestino: string;
  veiculo: string;
  data: string;
};

export default function TabTwoScreen() {
  const [registros, setRegistros] = useState<Registro[]>([]);

  const loadRegistros = async () => {
    try {
      const saved = await AsyncStorage.getItem("registros");
      if (saved) {
        setRegistros(JSON.parse(saved));
        Toast.show({
          type: "success",
          text1: "Registros atualizados ✅",
          position: "top",
          visibilityTime: 2000,
        });
      } else {
        await AsyncStorage.setItem("registros", JSON.stringify(registrosJSON));
        setRegistros(registrosJSON);
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Erro ao carregar registros ❌",
        position: "top",
        visibilityTime: 2000,
      });
    }
  };

  const copyRegistros = async () => {
    if (registros.length === 0) {
      Toast.show({
        type: "error",
        text1: "Nenhum registro disponível para copiar ❌",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    const texto =
      `Data,Uf_Origem,Cidade_Origem,Uf_Destino,Cidade_Destino,Veiculo\n` +
      registros
        .map(
          (r) =>
            `${formatDate(r.data, "csv")},${r.ufOrigem},${r.cidadeOrigem},${r.ufDestino},${r.cidadeDestino},${r.veiculo}`
        )
        .join("\n");

    await Clipboard.setStringAsync(texto);

    Toast.show({
      type: "success",
      text1: "Registros copiados ✅",
      position: "top",
      visibilityTime: 2000,
    });
  };

  useEffect(() => {
    loadRegistros();
  }, []);

  const formatDate = (iso: string, mode: string = "") => {
    const date = new Date(iso);
    if (mode === "csv") {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fdfdfd" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => await copyRegistros()}
          >
            <IconSymbol
              name="doc.on.doc"
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <ThemedText style={styles.buttonText}>Copiar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#4CAF50" }]}
            onPress={async () => await loadRegistros()}
          >
            <IconSymbol
              name="arrow.clockwise"
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <ThemedText style={styles.buttonText}>Atualizar</ThemedText>
          </TouchableOpacity>
        </View>
        {registros.length > 0 ? (
          [...registros]
            .sort(
              (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
            )
            .map((r, idx) => (
              <View key={idx} style={styles.card}>
                <ThemedText style={styles.cardText}>
                  <ThemedText style={styles.bold}>Origem:</ThemedText>{" "}
                  {r.cidadeOrigem}, {r.ufOrigem}
                </ThemedText>
                <ThemedText style={styles.cardText}>
                  <ThemedText style={styles.bold}>Destino:</ThemedText>{" "}
                  {r.cidadeDestino}, {r.ufDestino}
                </ThemedText>
                <ThemedText style={styles.cardText}>
                  <ThemedText style={styles.bold}>Veículo:</ThemedText>{" "}
                  {r.veiculo}
                </ThemedText>
                <ThemedText style={styles.dateText}>
                  {formatDate(r.data)}
                </ThemedText>
              </View>
            ))
        ) : (
          <ThemedText
            style={{ textAlign: "center", fontWeight: 700, color: "#222" }}
          >
            Ainda não há registros.
          </ThemedText>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={async () => {
            await AsyncStorage.removeItem("registros");
            setRegistros([]);
          }}
        >
          <ThemedText style={styles.deleteButtonText}>Apagar tudo</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  bold: {
    fontWeight: "700",
    color: "#222",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#555",
    paddingVertical: 14,
    paddingHorizontal: 24,
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
  dateText: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
    textAlign: "right",
  },
  deleteButton: {
    marginTop: 20,
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
