import SkillTrack from "../models/SkillTrack.js";
import Career from "../models/Career.js";
import { skillTracksSeed } from "../data/skillTracksSeed.js";
import { careersSeed } from "../data/careersSeed.js";

let tracksCache = [];
let careersCache = [];

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mapTrackDoc(doc) {
  return {
    id: doc.trackId,
    name: doc.name,
    icon: doc.icon,
    description: doc.description,
    lessonCount: doc.lessonCount,
    relatedSubjects: doc.relatedSubjects || [],
    relatedCareers: doc.relatedCareers || [],
  };
}

function mapCareerDoc(doc) {
  return {
    id: doc.careerId,
    name: doc.name,
    icon: doc.icon,
    stream: doc.stream,
    relatedSubjects: doc.relatedSubjects || [],
    skills: doc.skills || [],
    salary: doc.salary,
    demand: doc.demand,
    path: doc.path || [],
    description: doc.description,
  };
}

export function getSkillTracksData() {
  return tracksCache.length ? tracksCache : skillTracksSeed;
}

export function getCareersData() {
  return careersCache.length ? careersCache : careersSeed;
}

export async function refreshSkillCareerCaches() {
  const [tracks, careerDocs] = await Promise.all([
    SkillTrack.find({ active: true }).sort({ sortOrder: 1, name: 1 }).lean(),
    Career.find({ active: true }).sort({ sortOrder: 1, name: 1 }).lean(),
  ]);

  tracksCache = tracks.map(mapTrackDoc);
  careersCache = careerDocs.map(mapCareerDoc);
}

export async function initSkillCareerContent() {
  const trackCount = await SkillTrack.countDocuments();
  if (trackCount === 0) {
    await SkillTrack.insertMany(
      skillTracksSeed.map((track, index) => ({
        trackId: track.id,
        name: track.name,
        icon: track.icon,
        description: track.description,
        lessonCount: track.lessonCount,
        relatedSubjects: track.relatedSubjects,
        relatedCareers: track.relatedCareers,
        sortOrder: index,
        active: true,
      }))
    );
  }

  const careerCount = await Career.countDocuments();
  if (careerCount === 0) {
    await Career.insertMany(
      careersSeed.map((career, index) => ({
        careerId: career.id,
        name: career.name,
        icon: career.icon,
        stream: career.stream,
        relatedSubjects: career.relatedSubjects,
        skills: career.skills,
        salary: career.salary,
        demand: career.demand,
        path: career.path,
        description: career.description,
        sortOrder: index,
        active: true,
      }))
    );
  }

  await refreshSkillCareerCaches();
}

function parseList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(value || "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function listSkillTracksForAdmin() {
  return SkillTrack.find().sort({ sortOrder: 1, name: 1 });
}

export async function listCareersForAdmin() {
  return Career.find().sort({ sortOrder: 1, name: 1 });
}

export async function createSkillTrack(payload) {
  const trackId = slugify(payload.trackId || payload.name);
  if (!trackId) {
    throw new Error("Track name is required");
  }

  const existing = await SkillTrack.findOne({ trackId });
  if (existing) {
    throw new Error("A skill track with this id already exists");
  }

  const created = await SkillTrack.create({
    trackId,
    name: payload.name.trim(),
    icon: payload.icon || "💡",
    description: payload.description || "",
    lessonCount: Number(payload.lessonCount) || 12,
    relatedSubjects: parseList(payload.relatedSubjects),
    relatedCareers: parseList(payload.relatedCareers),
    sortOrder: Number(payload.sortOrder) || 0,
    active: payload.active !== false,
  });

  await refreshSkillCareerCaches();
  return created;
}

export async function updateSkillTrack(id, payload) {
  const updated = await SkillTrack.findByIdAndUpdate(
    id,
    {
      name: payload.name?.trim(),
      icon: payload.icon,
      description: payload.description,
      lessonCount: Number(payload.lessonCount),
      relatedSubjects: parseList(payload.relatedSubjects),
      relatedCareers: parseList(payload.relatedCareers),
      sortOrder: Number(payload.sortOrder) || 0,
      active: payload.active !== false,
    },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new Error("Skill track not found");
  }

  await refreshSkillCareerCaches();
  return updated;
}

export async function deleteSkillTrack(id) {
  const deleted = await SkillTrack.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error("Skill track not found");
  }
  await refreshSkillCareerCaches();
  return deleted;
}

export async function createCareer(payload) {
  const careerId = slugify(payload.careerId || payload.name);
  if (!careerId) {
    throw new Error("Career name is required");
  }

  const existing = await Career.findOne({ careerId });
  if (existing) {
    throw new Error("A career with this id already exists");
  }

  const created = await Career.create({
    careerId,
    name: payload.name.trim(),
    icon: payload.icon || "🎯",
    stream: payload.stream || "STEM",
    relatedSubjects: parseList(payload.relatedSubjects),
    skills: parseList(payload.skills),
    salary: payload.salary || "",
    demand: payload.demand || "High",
    path: parseList(payload.path),
    description: payload.description || "",
    sortOrder: Number(payload.sortOrder) || 0,
    active: payload.active !== false,
  });

  await refreshSkillCareerCaches();
  return created;
}

export async function updateCareer(id, payload) {
  const updated = await Career.findByIdAndUpdate(
    id,
    {
      name: payload.name?.trim(),
      icon: payload.icon,
      stream: payload.stream,
      relatedSubjects: parseList(payload.relatedSubjects),
      skills: parseList(payload.skills),
      salary: payload.salary,
      demand: payload.demand,
      path: parseList(payload.path),
      description: payload.description,
      sortOrder: Number(payload.sortOrder) || 0,
      active: payload.active !== false,
    },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new Error("Career not found");
  }

  await refreshSkillCareerCaches();
  return updated;
}

export async function deleteCareer(id) {
  const deleted = await Career.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error("Career not found");
  }
  await refreshSkillCareerCaches();
  return deleted;
}

export { slugify, parseList };
