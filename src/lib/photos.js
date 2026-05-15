import hero from "../assets/photos/seekiss.webp";

import gallery00 from "../assets/photos/00C6912F-2D07-4AB3-B998-F40319C1E386_1_105_c.webp";
import gallery01 from "../assets/photos/01189DB9-618B-4126-9772-16E5F48BD460_1_105_c.webp";
import gallery02 from "../assets/photos/0582F964-A66C-420C-9E7C-F3D42148E53A_1_105_c.webp";
import gallery03 from "../assets/photos/075782E1-1891-45B1-9759-F9A23CC0DAF2_1_105_c.webp";
import gallery04 from "../assets/photos/0BB965CC-56B6-4955-852C-BD5C3159A642_1_105_c.webp";
import gallery05 from "../assets/photos/2421B3FE-9C1D-4F1B-A105-7A2C81326816_1_105_c.webp";
import gallery06 from "../assets/photos/272D102A-EFBC-4505-9790-1282D69C8943_1_105_c.webp";
import gallery07 from "../assets/photos/28FF9374-F25F-43DF-9C2E-99D5BB6103BE_1_105_c.webp";
import gallery08 from "../assets/photos/2A22389F-2B4E-4379-BF6C-19959377D871_1_105_c.webp";
import gallery09 from "../assets/photos/2AD3AEBF-5487-4AB3-A7E8-EEB9B486D1CA_1_105_c.webp";
import gallery10 from "../assets/photos/2C3AF612-F964-48BD-A307-3A691CF0B995_1_105_c.webp";
import gallery11 from "../assets/photos/2DE5437A-FF67-486A-BC47-39C736FB203A_1_105_c.webp";
import gallery12 from "../assets/photos/2EDCE177-98DE-4737-A59F-AE3825DE9973_1_105_c.webp";
import gallery13 from "../assets/photos/3B5C65C9-691C-4C58-827E-5CA4EAAA03DB_1_105_c.webp";
import gallery14 from "../assets/photos/42306CE7-AFDF-41BA-8619-C9934888E403_1_105_c.webp";
import gallery15 from "../assets/photos/425309F6-45CF-4814-8177-48B9FCA1E45F_1_105_c.webp";
import gallery16 from "../assets/photos/4924C9A0-5836-4954-8095-380D9E7DBBFC_1_105_c.webp";
import gallery17 from "../assets/photos/4B88508E-1ECD-404D-B484-D67D190E0143_1_105_c.webp";
import gallery18 from "../assets/photos/522BC7E5-DD32-4C21-B343-A28B5B30CCF6_1_105_c.webp";
import gallery19 from "../assets/photos/5440884A-8DCB-47FC-8955-FA5E220F19CF_1_105_c.webp";
import gallery20 from "../assets/photos/5BB9F429-B095-429F-B8D5-1CDB669E605A_1_105_c.webp";
import gallery21 from "../assets/photos/687B21D5-9E53-468A-BDBB-AEC40CECECBC_1_105_c.webp";
import gallery22 from "../assets/photos/69480869-B153-406C-99F3-0E85CB320D82_1_105_c.webp";
import gallery23 from "../assets/photos/6A326BE1-93D5-4C5D-9286-4F3D0545978C_1_105_c.webp";
import gallery24 from "../assets/photos/8139806A-A6C0-4DAC-87F3-41694ED0B821_1_105_c.webp";
import gallery25 from "../assets/photos/AD49BE89-4129-4833-AD72-E1A05AEE2DC8_1_105_c.webp";

export const heroPhoto = hero;

export const storyPhoto = gallery12;

export const featurePhotos = [
  { src: gallery04, alt: "婚纱照精选 1" },
  { src: gallery17, alt: "婚纱照精选 2" },
  { src: gallery24, alt: "婚纱照精选 3" },
  { src: gallery25, alt: "婚纱照精选 4" },
];

export const galleryPhotos = [
  gallery00,
  gallery01,
  gallery02,
  gallery03,
  gallery04,
  gallery05,
  gallery06,
  gallery07,
  gallery08,
  gallery09,
  gallery10,
  gallery11,
  gallery12,
  gallery13,
  gallery14,
  gallery15,
  gallery16,
  gallery17,
  gallery18,
  gallery19,
  gallery20,
  gallery21,
  gallery22,
  gallery23,
].map((src, index) => ({ src, alt: `婚纱照 ${index + 1}` }));
