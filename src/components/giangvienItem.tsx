import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GiangVien } from "../types/giangvien";

type Props = {
  gv: GiangVien;
  onEdit: (id: string) => void;
  onDelete: (gv: GiangVien) => void;
};

function GiangVienItem({ gv, onEdit, onDelete }: Props) {
  const initial = (gv.Fullname?.trim()[0] || "?").toUpperCase();

  return (
    <View style={styles.card}>
      {gv.Image ? (
        <Image
          source={{ uri: gv.Image }}
          style={styles.avatar}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {gv.Fullname}
        </Text>
        <Text style={styles.text}>Mã GV: {gv.IDGV}</Text>
        <Text style={styles.text}>Tổng số lớp: {gv.SumClass}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            styles.edit,
            pressed && styles.pressed,
          ]}
          onPress={() => onEdit(gv.IDGV)}
        >
          <Text style={styles.btnText}>Sửa</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            styles.del,
            pressed && styles.pressed,
          ]}
          onPress={() => onDelete(gv)}
        >
          <Text style={styles.btnText}>Xóa</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default memo(GiangVienItem);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E0E0E0",
  },
  avatarFallback: {
    backgroundColor: "#1976D2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 22, fontWeight: "700" },
  info: { flex: 1, marginLeft: 14, marginRight: 8 },
  name: { fontSize: 16, fontWeight: "700", color: "#212121" },
  text: { fontSize: 13, color: "#757575", marginTop: 2 },
  actions: { gap: 8 },
  btn: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  edit: { backgroundColor: "#1976D2" },
  del: { backgroundColor: "#E53935" },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  pressed: { opacity: 0.75 },
});
