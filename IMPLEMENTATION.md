[![Watch the video](https://img.youtube.com/vi/YOUTUBE_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=EAumBs3N_Bw)


# Full Stack Engineering Challenge Implementation - Enzo Filippo

## Problem

Extend the existing application's functionnality to:

- Enable users to create subtasks via the UI
- Retrieve subtasks on demand via the backend API

## Potential Questions

Based on the requirements and existing codebase, here are some questions I could have asked prior to starting:

- Should we build the additional feature using the existing libraries and packages in the codebase?

- What's the expected nesting depth limit for subtasks? Should we prevent infinite nesting?

- What's the preferred approach for state management when adding subtasks - optimistic updates or server revalidation?

- Should we implement any caching strategy for subtasks to improve performance?

## Approach & Implementation

### 1. Backend API Extension

- Added a new route `GET /api/tasks/:id/subtasks` that allows to retrieve all subtasks for a given `parentId`.

- Created a `getSubtasks()` method in the TasksService that queries tasks by `parentId`

### 2. Data structure concern

- **Issue Identified:** There was a discrepancy between the backend response format and the frontend TypeScript interface:

- Backend returns:

```bash
{
    id: number,
    title: string,
    parent?: { id: number, title: string }
    subtasks?: Task[],
}
```

while the Frontend expects:

```bash
{
    id: number;
    title: string;
    parentId?: number;
    subtasks?: Task[];
}
```

- **Solution Applied**: Modified the frontend Task interface to match the backend response format by replacing `parentId?: number` with `parent?: { id: number, title: string }`.

- **Assessment**: This was a pragmatic solution, but there are other approaches to consider:
  1. Transform data at the API boundary - Keep interfaces separate and transform data in the API layer;
  2. Backend serialisation - Modify backend to return parentId instead of the full parent object;
  3. Frontend adaptation - Create separate types for API responses vs. component props;

### 3. Frontend API Integration

- Added `fetchSubtasks` function to `api.ts` that makes GET requests to `/api/tasks/${parentId}/subtasks`

### 4. `TaskContext.tsx` Optimisation

- Modified the `addTask` function to use direct state updates instead of refetching all tasks from the server.

- **Why**: Allows for a more efficient function runtime and a quicker component update in the UI.

- **Assessment**: This is a good performance optimisation for single-user scenarios. However, this approach has limitations in multi-user environments. For production applications, we could consider:
  - Implementing WebSocket connections for real-time updates
  - Using a state management library with built-in synchronisation (e.g., SWR, React Query)

### 5. `App.tsx` Enhancements

- Added validation to prevent adding empty tasks.
- Applied basic styling improvements.

### 6. `TaskList.tsx` Component Updates

- Updated task filtering to use `task.parent` instead of `task.parentId` to reflect the changes made in **_Step 2_**
- Applied basic styling improvements.

### 7. `TaskItem.tsx` Component - Core Functionality

- Implemented the "Create subtasks" functionality:

  - **_Expandable Interface_**: Tasks can be expanded to show subtasks
  - **_On-demand Loading_**: Subtasks are fetched only when needed
  - **_Caching Strategy_**: Subtasks are cached in local state to prevent redundant API calls
  - **_SubtaskForm Component_**: Inline form for creating new subtasks
  - **_State Management_**: Proper handling of loading and error states
  - **_Optimistic Updates_**: New subtasks appear immediately in the UI

- Applied basic styling improvements.

## Roadmap / List of ideas

- **Complete CRUD Operations**: Implement Update and Delete functionality for both tasks and subtasks
- **Data Validation**: Add comprehensive validation on both frontend and backend (required fields, character limits, etc.)
- **Advanced State Management**: Implement TanStack Query (React Query) for robust data fetching, caching, and synchronisation
- **Task Status Management**: Add task states like "To Do", "In Progress", "Completed" with appropriate UI indicators
- **Drag & Drop**: Enable reordering of tasks and moving tasks between different parents
- **Search & Filtering**: Add search functionality and filters by status, date created, etc.
