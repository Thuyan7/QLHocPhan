import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { GiangVien, GiangVienInput } from "../types/giangvien";
import { db } from "./firebase";

const col = collection(db, "GiangVien");

export const addGiangVien = async (data: GiangVienInput) => {
  const ref = doc(col, data.IDGV);
  if ((await getDoc(ref)).exists()) throw new Error("Mã IDGV đã tồn tại");
  await setDoc(ref, data);
};

export const subscribeGiangVien = (cb: (list: GiangVien[]) => void) =>
  onSnapshot(col, (snap) => {
    cb(snap.docs.map((d) => d.data() as GiangVien));
  });

export const getGiangVien = async (id: string): Promise<GiangVien | null> => {
  const s = await getDoc(doc(col, id));
  return s.exists() ? (s.data() as GiangVien) : null;
};

export const updateGiangVien = (id: string, data: GiangVienInput) =>
  updateDoc(doc(col, id), {
    Fullname: data.Fullname,
    Image: data.Image,
    SumClass: data.SumClass,
  });

export const deleteGiangVien = (id: string) => deleteDoc(doc(col, id));
