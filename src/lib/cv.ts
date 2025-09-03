export type CvMeta = { 
  name: string; 
  size: number; 
  type: 'application/pdf'; 
  hash: string;
};

export const CvService = {
  prepareUpload: async (_meta: CvMeta) => {
    // TODO: Firebase Storage integration
    // const storage = getStorage();
    // const storageRef = ref(storage, `cvs/${_meta.hash}.pdf`);
    // const uploadTask = uploadBytesResumable(storageRef, file);
    // 
    // TODO: Firestore document creation
    // const db = getFirestore();
    // await addDoc(collection(db, 'cv_uploads'), {
    //   filename: _meta.name,
    //   size: _meta.size,
    //   hash: _meta.hash,
    //   uploadedAt: serverTimestamp(),
    //   status: 'pending'
    // });

    console.log('TODO: Prepare CV upload for', _meta.name);
    return { ok: true as const };
  }
};