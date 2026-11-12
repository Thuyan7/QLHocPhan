import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GiangVienItem from "../components/giangvienItem";
import { auth } from "../services/firebase";
import {
  deleteGiangVien,
  subscribeGiangVien,
} from "../services/giangvienService";
import { GiangVien } from "../types/giangvien";

export default function GiangVienList() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [list, setList] = useState<GiangVien[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const unsub = subscribeGiangVien(setList);
    return unsub;
  }, []);

  const onEdit = useCallback(
    (id: string) => router.push({ pathname: "/form", params: { id } }),
    [router],
  );

  const doDelete = async (gv: GiangVien) => {
    try {
      await deleteGiangVien(gv.IDGV);
    } catch (e) {
      Alert.alert("Lỗi", String(e));
    }
  };

  const onDelete = useCallback((gv: GiangVien) => {
    if (Platform.OS === "web") {
      if (window.confirm(`Xóa giảng viên "${gv.Fullname}"?`)) doDelete(gv);
      return;
    }
    Alert.alert("Xác nhận", `Xóa giảng viên "${gv.Fullname}"?`, [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: () => doDelete(gv) },
    ]);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: GiangVien }) => (
      <GiangVienItem gv={item} onEdit={onEdit} onDelete={onDelete} />
    ),
    [onEdit, onDelete],
  );

  const data = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return list;
    return list.filter(
      (g) =>
        g.Fullname.toLowerCase().includes(k) ||
        g.IDGV.toLowerCase().includes(k),
    );
  }, [list, keyword]);

  return (
    <View style={styles.page}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.headerBg, { paddingTop: insets.top + 12 }]}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Quản lý giảng viên</Text>
              <Text style={styles.subtitle}>{data.length} giảng viên</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.logoutBtn,
                pressed && styles.pressed,
              ]}
              onPress={() => signOut(auth)}
            >
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </Pressable>
          </View>

          <TextInput
            style={styles.search}
            placeholder="Tìm theo IDGV / họ tên"
            placeholderTextColor="#9E9E9E"
            value={keyword}
            onChangeText={setKeyword}
          />
        </View>
      </View>

      <View style={[styles.inner, { flex: 1 }]}>
        <FlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={(g) => g.IDGV}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={styles.empty}>Chưa có giảng viên</Text>
          }
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { bottom: insets.bottom + 24 },
          pressed && styles.pressed,
        ]}
        onPress={() => router.push("/form")}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F4F6F8" },
  inner: { width: "100%", maxWidth: 720, alignSelf: "center" },
  headerBg: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#fff" },
  subtitle: { fontSize: 13, color: "#BBDEFB", marginTop: 2 },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  logoutText: { color: "#fff", fontWeight: "600" },
  search: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
  },
  empty: { textAlign: "center", marginTop: 60, color: "#9E9E9E", fontSize: 15 },
  fab: {
    position: "absolute",
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#43A047",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabText: { color: "#fff", fontSize: 32, lineHeight: 34 },
  pressed: { opacity: 0.8 },
});
