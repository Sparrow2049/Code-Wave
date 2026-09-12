import { getCourses, listResources } from "@/lib/db";
import ResourceCard from "@/components/ResourceCard";
import ResourceForm from "@/components/ResourceForm";
import EmptyState from "@/components/EmptyState";
import CourseFilterRow from "@/components/CourseFilterRow";
import SearchBar from "@/components/SearchBar";

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; query?: string }>;
}) {
  const { course, query } = await searchParams;
  const courses = await getCourses();
  
  // Fetch initial resources for the selected course
  let resources = await listResources(course);

  // Filter resources in memory by title or description if a query exists
  if (query) {
    const searchTerm = query.toLowerCase();
    resources = resources.filter(
      (r) =>
        r.title.toLowerCase().includes(searchTerm) ||
        (r.description && r.description.toLowerCase().includes(searchTerm))
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-3xl text-text">Resources</h1>
      <p className="mt-1.5 text-text-muted">
        Notes, past papers, and repos — organized by course.
      </p>

      {/* Search Bar */}
      <div className="mt-6">
        <SearchBar />
      </div>

      {/* Course Filter Pills */}
      <div className="mt-4">
        <CourseFilterRow
          courses={courses}
          basePath="/resources"
          selected={course}
        />
      </div>

      {/* Resource Cards */}
      <div className="mt-6 space-y-3">
        {resources.length === 0 ? (
          <EmptyState
            title={query ? `No results for "${query}"` : "Nothing here yet"}
            description={
              query
                ? "Try searching for a different keyword or clearing the search."
                : "Be the first to share something for this course."
            }
          />
        ) : (
          resources.map((r) => (
            <ResourceCard key={r.id} resource={r} showCourse={!course} />
          ))
        )}
      </div>

      {/* Resource Upload Form */}
      <div className="mt-6">
        <ResourceForm courses={courses} lockedCourseCode={course} />
      </div>
    </div>
  );
}