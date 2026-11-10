import type { Room } from "../types";
const photos = {
  hero: "https://images.unsplash.com/photo-1790276319819-124404931132?auto=format&fit=crop&w=2000&q=88",
  suite:
    "https://images.unsplash.com/photo-1774423864869-702b21c2490a?auto=format&fit=crop&w=1200&q=85",
  doble:
    "https://images.unsplash.com/photo-1765421617367-4b6f88423be9?auto=format&fit=crop&w=1200&q=85",
  sencilla:
    "https://images.unsplash.com/photo-1743805024402-ca2e66e993c7?auto=format&fit=crop&w=1200&q=85",
};

const roomGroups = [
  {
    type: "Suite",
    names: ["Mar Abierto", "Punta Cometa", "Luz del Pacífico", "Horizonte"],
    guests: 2,
    beds: "1 cama king",
    price: 4380,
    image: photos.suite,
    description:
      "Una suite amplia frente al Pacífico, con terraza privada, hamaca y baño de piedra natural.",
    features: ["Vista directa al mar", "Desayuno incluido", "Terraza privada"],
  },
];

const roomTags = [
  "Última disponible",
  "Más elegida",
  "Vista especial",
  "Muy solicitada",
  "Desayuno incluido",
  "Mejor ubicación",
  "Disponible",
];

export const rooms: Room[] = roomGroups.flatMap((group, groupIndex) =>
  group.names.map((name, roomIndex) => ({
    id: groupIndex * 4 + roomIndex + 1,
    name:
      group.type === "Sencilla" && roomIndex === 0
        ? name
        : `${group.type} ${name}`,
    type: group.type,
    guests: group.guests,
    beds: group.beds,
    price: group.price + roomIndex * 120,
    image: group.image,
    tag: roomTags[roomIndex],
    description: group.description,
    features: group.features,
  })),
);

export { photos };
