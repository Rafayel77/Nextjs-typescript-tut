/* eslint-disable no-console */
import { addDoc, collection, query, getDocs, updateDoc, orderBy, doc, getDoc, serverTimestamp} from "firebase/firestore";
import { db } from "./firebase";

export const setCardVote = async (userEmail: string, title: string, text: string, example: string, tags: string[], username: string,) => {
  try {
    const collectionRef = collection(db, "cards");
    const docRef = await addDoc(collectionRef, {
      userEmail: userEmail,
      title: title,
      text: text,
      example: example,
      tags: tags,
      username: username,
      like: 0,
      dislike: 0,
      userIdsWhoLiked: [],
      userIdsWhoDisliked: [],
      created: serverTimestamp(),
      addItCountI: 0,
      keepOutCountI: 0,
      cantDecideCountI: 0,
      userIdsWhoAddIt: [],
      userIdsWhoKeepOut: [],
      userIdsWhoCantDecide: []
    });
    const cardId = docRef.id;
    await updateDoc(docRef, { cardId: docRef.id });
    return cardId;
  } catch(error) {
    alert(error);
    return null;
  }
};

export const getCardData = async (cardId: string) => {
  try {
    const docRef = doc(db, "cards", cardId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const cardData = docSnap.data();
      return cardData;
    }

    throw new Error("Card not found");
  } catch(error) {
    alert(error);
    throw error;
  }
};

export const getUserVote = async (cardId: string, userId: string) => {
  try {
    const docRef = doc(db, "cards", cardId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (data) {
        const userIdsWhoLiked = data.userIdsWhoLiked || [];
        const userIdsWhoDisliked = data.userIdsWhoDisliked || [];

        if (userIdsWhoLiked.includes(userId)) {
          return "like";
        } else if (userIdsWhoDisliked.includes(userId)) {
          return "dislike";
        }
      }
    }

    return null;
  } catch(error) {
    alert(error);
    return null;
  }
};


export const updateCardVote = async (cardId: string, userId: string, isLiked: boolean, isDisliked: boolean) => {
  try {
    const docRef = doc(db, "cards", cardId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (data) {
        const likeCount = data.like || 0;
        const dislikeCount = data.dislike || 0;
        const userIdsWhoLiked = data.userIdsWhoLiked || [];
        const userIdsWhoDisliked = data.userIdsWhoDisliked || [];

        const hasLiked = userIdsWhoLiked.includes(userId);
        const hasDisliked = userIdsWhoDisliked.includes(userId);

        if (isLiked && !hasLiked) {
          userIdsWhoLiked.push(userId);
          await updateDoc(docRef, {
            like: likeCount + 1,
            dislike: hasDisliked ? dislikeCount - 1 : dislikeCount,
            userIdsWhoLiked: userIdsWhoLiked,
            userIdsWhoDisliked: hasDisliked ? userIdsWhoDisliked.filter((id: string) => id !== userId) : userIdsWhoDisliked,
          });
        } else if (isDisliked && !hasDisliked) {
          userIdsWhoDisliked.push(userId);
          await updateDoc(docRef, {
            dislike: dislikeCount + 1,
            like: hasLiked ? likeCount - 1 : likeCount,
            userIdsWhoDisliked: userIdsWhoDisliked,
            userIdsWhoLiked: hasLiked ? userIdsWhoLiked.filter((id: string) => id !== userId) : userIdsWhoLiked,
          });
        } else if (!isLiked && hasLiked) {
          const index = userIdsWhoLiked.indexOf(userId);
          userIdsWhoLiked.splice(index, 1);
          await updateDoc(docRef, {
            like: likeCount - 1,
            userIdsWhoLiked: userIdsWhoLiked,
          });
        } else if (!isDisliked && hasDisliked) {
          const index = userIdsWhoDisliked.indexOf(userId);
          userIdsWhoDisliked.splice(index, 1);
          await updateDoc(docRef, {
            dislike: dislikeCount - 1,
            userIdsWhoDisliked: userIdsWhoDisliked,
          });
        }
      }
    }
  } catch(error) {
    alert(error);
  }
};


export const updateCardUserIds = async (cardId: string, userId: string, action: string) => {
  const docRef = doc(db, "cards", cardId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data) {
      const addItCount = data.addItCountI || 0;
      const keepOutCount = data.keepOutCountI || 0;
      const cantDecideCount = data.cantDecideCountI || 0;

      const updatedUserIdsWhoAddIt = data.userIdsWhoAddIt.filter((id: string) => id !== userId);
      const updatedUserIdsWhoKeepOut = data.userIdsWhoKeepOut.filter((id: string) => id !== userId);
      const updatedUserIdsWhoCantDecide = data.userIdsWhoCantDecide.filter((id: string) => id !== userId);

      const hasVotedAddIt = data.userIdsWhoAddIt.includes(userId);
      const hasVotedKeepOut = data.userIdsWhoKeepOut.includes(userId);
      const hasVotedCantDecide = data.userIdsWhoCantDecide.includes(userId);


      if (action === "addIt") {
        if (!hasVotedAddIt) {
          await updateDoc(docRef, {
            userIdsWhoAddIt: [...updatedUserIdsWhoAddIt, userId],
            addItCountI: addItCount + 1,
            userIdsWhoKeepOut: updatedUserIdsWhoKeepOut,
            keepOutCountI: keepOutCount - (hasVotedKeepOut ? 1 : 0),
            userIdsWhoCantDecide: updatedUserIdsWhoCantDecide,
            cantDecideCountI: cantDecideCount - (hasVotedCantDecide ? 1 : 0),
          });
        } else {
          await updateDoc(docRef, {
            userIdsWhoAddIt: updatedUserIdsWhoAddIt,
            addItCountI: addItCount - 1,
          });
        }
      } else if (action === "keepOut") {
        if (!hasVotedKeepOut) {
          await updateDoc(docRef, {
            userIdsWhoKeepOut: [...updatedUserIdsWhoKeepOut, userId],
            keepOutCountI: keepOutCount + 1,
            userIdsWhoAddIt: updatedUserIdsWhoAddIt,
            addItCountI: addItCount - (hasVotedAddIt ? 1 : 0),
            userIdsWhoCantDecide: updatedUserIdsWhoCantDecide,
            cantDecideCountI: cantDecideCount - (hasVotedCantDecide ? 1 : 0),
          });
        } else {
          await updateDoc(docRef, {
            userIdsWhoKeepOut: updatedUserIdsWhoKeepOut,
            keepOutCountI: keepOutCount - 1,
          });
        }
      } else if (action === "cantDecide") {
        if (!hasVotedCantDecide) {
          await updateDoc(docRef, {
            userIdsWhoCantDecide: [...updatedUserIdsWhoCantDecide, userId],
            cantDecideCountI: cantDecideCount + 1,
            userIdsWhoAddIt: updatedUserIdsWhoAddIt,
            addItCountI: addItCount - (hasVotedAddIt ? 1 : 0),
            userIdsWhoKeepOut: updatedUserIdsWhoKeepOut,
            keepOutCountI: keepOutCount - (hasVotedKeepOut ? 1 : 0),
          });
        } else {
          await updateDoc(docRef, {
            userIdsWhoCantDecide: updatedUserIdsWhoCantDecide,
            cantDecideCountI: cantDecideCount - 1,
          });
        }
      }
    }
  }
};


export const getCardInfo = async () => {
  const collectionRef = collection(db, "cards");
  const q = query(collectionRef, orderBy("created", "desc"));
  try {
    const querySnapshot = await getDocs(q);
    const cardData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        created: data.created.toDate().toISOString(),
      };
    });
    return cardData;
  } catch (error) {
    alert(error);
  }
};


export const getUserVotedAction = async (cardId: string, userId: string) => {
  try {
    const docRef = doc(db, "cards", cardId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (data) {
        const userIdsWhoVotedAddIt = data.userIdsWhoAddIt || [];
        const userIdsWhoVotedKeepOut = data.userIdsWhoKeepOut || [];
        const userIdsWhoVotedCantDecide = data.userIdsWhoCantDecide || [];

        if (userIdsWhoVotedAddIt.includes(userId)) {
          return "addIt";
        } else if (userIdsWhoVotedKeepOut.includes(userId)) {
          return "keepOut";
        } else if (userIdsWhoVotedCantDecide.includes(userId)) {
          return "cantDecide";
        }
      }
    }

    return null;
  } catch (error) {
    alert(error);
    return null;
  }
};
