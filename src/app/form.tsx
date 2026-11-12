import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  addGiangVien,
  getGiangVien,
  updateGiangVien,
} from "../services/giangvienService";

export default function GiangVienForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const isEdit = Boolean(id);

  const [idgv, setIdgv] = useState("");
  const [fullname, setFullname] = useState("");
  const [sumClass, setSumClass] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!id) return;
    getGiangVien(id).then((g) => {
      if (!g) return;
      setIdgv(g.IDGV);
      setFullname(g.Fullname);
      setSumClass(String(g.SumClass));
      setImage(g.Image);
    });
  }, [id]);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Cần cấp quyền truy cập thư viện ảnh");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });

    if (!res.canceled && res.assets[0].base64) {
      setImage(`data:image/jpeg;base64,${res.assets[0].base64}`);
    }
  };

  const onSave = async () => {
    if (!idgv.trim() || !fullname.trim() || sumClass.trim() === "") {
      Alert.alert("Vui lòng nhập đủ IDGV, họ tên, tổng số lớp");
      return;
    }
    const n = Number(sumClass);
    if (!Number.isInteger(n) || n < 0) {
      Alert.alert("Tổng số lớp phải là số nguyên không âm");
      return;
    }

    const data = {
      IDGV: idgv.trim(),
      Fullname: fullname.trim(),
      Image: image,
      SumClass: n,
    };

    try {
      if (id) await updateGiangVien(id, data);
      else await addGiangVien(data);
      if (router.canGoBack()) router.back();
      else router.replace("/");
    } catch (e) {
      Alert.alert("Lỗi", e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isEdit ? "Sửa giảng viên" : "Thêm giảng viên"}
      </Text>

      <Pressable onPress={pickImage} style={styles.avatarWrap}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.avatar}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.avatar, styles.placeholder]}>
            <Text style={{ color: "#1976D2", fontWeight: "600" }}>
              Chọn ảnh
            </Text>
          </View>
        )}
      </Pressable>

      <TextInput
        style={[styles.input, isEdit && styles.disabled]}
        placeholder="Mã giảng viên (IDGV)"
        value={idgv}
        onChangeText={setIdgv}
        editable={!isEdit}
        autoCapitalize="characters"
      />
      <TextInput
        style={styles.input}
        placeholder="Họ và tên (Fullname)"
        value={fullname}
        onChangeText={setFullname}
      />
      <TextInput
        style={styles.input}
        placeholder="Tổng số lớp (SumClass)"
        keyboardType="numeric"
        value={sumClass}
        onChangeText={setSumClass}
      />

      <Pressable style={styles.btn} onPress={onSave}>
        <Text style={styles.btnText}>{isEdit ? "Cập nhật" : "Thêm"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
  },
  avatarWrap: { alignSelf: "center", marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  placeholder: {
    backgroundColor: "#E3F2FD",
    borderWidth: 2,
    borderColor: "#90CAF9",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 15,
  },
  disabled: { backgroundColor: "#EEEEEE", color: "#757575" },
  btn: {
    backgroundColor: "#43A047",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
