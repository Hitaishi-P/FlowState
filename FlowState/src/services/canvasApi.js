// src/services/canvasApi.js

const CANVAS_BASE_URL =
  import.meta.env.VITE_CANVAS_BASE_URL || "";

const CANVAS_API_TOKEN =
  import.meta.env.VITE_CANVAS_API_TOKEN || "";

/**
 * Low-level Canvas API request.
 *
 * This is intentionally isolated from the rest of the app so that
 * authentication/API details don't leak into components or the
 * scheduling engine.
 */
async function request(path) {
  if (!CANVAS_BASE_URL || !CANVAS_API_TOKEN) {
    throw new Error(
      "Canvas API is not configured. Add VITE_CANVAS_BASE_URL and VITE_CANVAS_API_TOKEN."
    );
  }

  const response = await fetch(
    `${CANVAS_BASE_URL.replace(/\/$/, "")}/api/v1/${path}`,
    {
      headers: {
        Authorization: `Bearer ${CANVAS_API_TOKEN}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Canvas request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Fetch the current user's Canvas courses.
 */
export function getCourses() {
  return request("courses?enrollment_state=active&per_page=100");
}

/**
 * Fetch assignments for a specific course.
 */
export function getAssignments(courseId) {
  return request(
    `courses/${courseId}/assignments?per_page=100`
  );
}

/**
 * Fetch assignments across all active courses.
 */
export async function getAllAssignments() {
  const courses = await getCourses();

  const courseAssignments = await Promise.all(
    courses.map(async (course) => {
      const assignments = await getAssignments(course.id);

      return assignments.map((assignment) => ({
        ...assignment,
        courseId: course.id,
        courseName: course.name,
      }));
    })
  );

  return courseAssignments.flat();
}

/**
 * Convert a Canvas assignment into Flowstate's internal task shape.
 *
 * Canvas doesn't know about cognitive load, so we estimate it from
 * the assignment's characteristics for now.
 */
export function normalizeCanvasAssignment(assignment) {
  return {
    id: `canvas-${assignment.id}`,
    source: "canvas",
    sourceId: assignment.id,

    title: assignment.name,

    description: assignment.description
      ? stripHtml(assignment.description)
      : "",

    courseId: assignment.courseId,
    courseName: assignment.courseName,

    dueDate: assignment.due_at || null,

    duration: estimateDuration(assignment),

    cognitiveLoad: estimateCognitiveLoad(assignment),

    completed:
      assignment.submission_types?.includes("online_text_entry") &&
      assignment.has_submitted_submissions === true,
  };
}

/**
 * Convert all Canvas assignments into Flowstate tasks.
 */
export function normalizeCanvasAssignments(assignments = []) {
  return assignments.map(normalizeCanvasAssignment);
}

/**
 * Rough duration estimate.
 *
 * This is deliberately conservative. Later, this can become smarter
 * using assignment type, course, historical completion time, etc.
 */
function estimateDuration(assignment) {
  const name = (assignment.name || "").toLowerCase();
  const description = stripHtml(assignment.description || "").toLowerCase();

  const text = `${name} ${description}`;

  if (
    text.includes("exam") ||
    text.includes("final") ||
    text.includes("project")
  ) {
    return 120;
  }

  if (
    text.includes("essay") ||
    text.includes("paper") ||
    text.includes("research")
  ) {
    return 90;
  }

  if (
    text.includes("quiz") ||
    text.includes("discussion") ||
    text.includes("reflection")
  ) {
    return 30;
  }

  return 60;
}

/**
 * Estimate cognitive load from assignment characteristics.
 *
 * This is a starting heuristic, not a medical/psychological assessment.
 */
function estimateCognitiveLoad(assignment) {
  const name = (assignment.name || "").toLowerCase();
  const description = stripHtml(
    assignment.description || ""
  ).toLowerCase();

  const text = `${name} ${description}`;

  if (
    text.includes("exam") ||
    text.includes("final") ||
    text.includes("project") ||
    text.includes("architecture") ||
    text.includes("research")
  ) {
    return "deep";
  }

  if (
    text.includes("essay") ||
    text.includes("paper") ||
    text.includes("analysis") ||
    text.includes("presentation")
  ) {
    return "medium";
  }

  if (
    text.includes("quiz") ||
    text.includes("discussion") ||
    text.includes("reflection") ||
    text.includes("review")
  ) {
    return "low";
  }

  return "medium";
}

/**
 * Canvas assignment descriptions are HTML.
 * Strip tags before putting them into the task model.
 */
function stripHtml(html) {
  if (!html) return "";

  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}