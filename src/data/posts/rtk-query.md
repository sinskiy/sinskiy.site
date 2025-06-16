---
title: "RTK Query (and a bit of Redux)"
description: "how to use; my experience and opinion"
pubDate: "Jun 16 2025"
---

in the [projects](https://sinskiy.site/#projects) section of my website, you can find an overengineered project called `visit this, please!`. since many companies require proficiency in [Redux](https://redux.js.org/), and i had yet to try [RTK Query](https://redux-toolkit.js.org/rtk-query/overview), i chose to replace [React Query](https://tanstack.com/query/latest/docs/framework/react/overview) with these technologies to make my website even more overengineered

> i have some small projects with Redux, but they aren't on my resume. the same goes for Redis, which i plan to add to the site later

## Redux set up

first, i installed the necessary dependencies:

```bash
npm install @reduxjs/toolkit react-redux
```

RTK Query is included in `@reduxjs/toolkit/query/react`

then, i needed to set up them. since i don't use a feature-based folder structure, all my slices reside in `src/slices`

you probably already know how to set up a Redux Toolkit project with TypeScript. if not, check out the [Quick Start](https://redux-toolkit.js.org/tutorials/quick-start) and [TypeScript](https://redux-toolkit.js.org/tutorials/typescript) guides in the docs. here's how my only slice looks:

```ts
import { User } from "@/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SessionState = {
  user: User | null;
};

export const sessionSlice = createSlice({
  name: "session",
  initialState: { user: null } as SessionState,
  reducers: {
    setSession: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setSession } = sessionSlice.actions;

export default sessionSlice.reducer;
```

RTK Query will handle the rest

now Redux Toolkit is working. adding the following to a component returns inital state, which is `null`:

```ts
// ...

export default function Component() {
  const user = useAppSelector((state) => state.session.user);
  console.log(user);

  // ...
}
```

## what is RTK Query?

an example of RTK Query code will likely look familiar. here's what i use in my `Home` component:

```ts
// familiar properties, huh? except there's a named hook instead of useQuery
const { data, isLoading, error } = useGetPlacesQuery({
  sort,
  filter,
  page,
  search,
});

// only need the result to display loading and error states globally
const [, result] = useUpdateVoteByPlaceIdMutation();

/* prefetch on hover or focus:
<Card
  onFocus={() =>
    prefetchPlace({ id: place._id })
  }
  onMouseEnter={() =>
    prefetchPlace({ id: place._id })
  }
/>
*/
const prefetchPlace = usePrefetch("getPlaceById");
```

here's an example of using a mutation (definitely not the best code, it was written many months ago):

```tsx
function Votes({
  placeId,
  down,
  up,
  voted,
}: {
  placeId: string;
  down: number;
  up: number;
  voted: VoteType | undefined;
}) {
  const [addVote, result] = useUpdateVoteByPlaceIdMutation();
  const user = useAppSelector((state) => state.session.user);

  return (
    <>
      <CheckboxField
        type="radio"
        onChange={() => addVote({ type: "UP", id: placeId })}
        onClick={() => voted === "UP" && addVote({ type: null, id: placeId })}
        disabled={!user || result.isLoading}
        checked={voted === "UP"}
      />
      <GeneralVoteCount>{up - down}</GeneralVoteCount>
      <CheckboxField
        type="radio"
        onChange={() => addVote({ type: "DOWN", id: placeId })}
        onClick={() => voted === "DOWN" && addVote({ type: null, id: placeId })}
        disabled={!user || result.isLoading}
        checked={voted === "DOWN"}
      />
    </>
  );
}
```

as you can see, differences from React Query are minimal:

- there's no `queryClient`, but `<yourApi>.util` offers some similar functionality, though you often don't need it
- instead of generic `useQuery` and `useMutation`, RTK Query generates named hooks from your endpoints. this is arguably more readable
- mutations return a tuple with `[mutate, data]`. in my opinion, this is better, as renaming `mutate` is easier

fun fact i noticed: both RTK Query and React Query don't allow passing multiple arguments to a mutation. this is probably better for readability, but i have mixed feelings about this. sometimes just passing two arguments would be simpler

## so, where do these hooks come from?

it's similar to how you export actions from Redux slices

```ts
// for comparison, src/slices/sessionSlice.ts
export const { setSession } = sessionSlice.actions;

// src/services/api.ts
export const {
  usePrefetch,
  useGetPlacesQuery,
  useAddPlaceMutation,
  useEditPlaceMutation,
  useGetPlaceByIdQuery,
  useDeletePlaceByIdMutation,
  // ...
} = api;
```

but what is `api`? it's basically a slice. at least it looks like one:

```ts
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL,
    credentials: "include",
  }),
  tagTypes: ["Session", "Places", "PlacesSort", "PlacesFilter"],
  endpoints: (builder) => ({
    // ...
  }),
});
```

important to notice:

- `fetchBaseQuery` is a fetch wrapper, think of it like Axios. it is used when an endpoint is triggered
- tags are specified in advance

basically, these properties prepare our endpoints

the actual endpoints look like this:

```ts
export const api = createApi({
  // ...
  endpoints: (builder) => ({
    getPlaces: builder.query<Place[], PlacesQuery>({
      query: ({ sort, filter, page, search }) =>
        `/places?sort=${sort}&filter=${filter}&page=${page}&search=${search}`,
      providesTags: (_response, _error, { sort, filter }) => [
        { type: "Places", id: "LIST" },
        { type: "PlacesSort", id: sort },
        { type: "PlacesFilter", id: filter },
        "Session",
      ],
    }),
    addPlace: builder.mutation<void, EditPlaceSchema>({
      query: (data) => ({
        url: "/places",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Places", id: "LIST" }],
    }),
    editPlace: builder.mutation<void, EditPlaceMutation>({
      query: (data) => ({
        url: `/places/${placeId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_response, _error, { placeId }) => [
        { type: "Places", id: "LIST" },
        { type: "Places", id: placeId },
      ],
    }),
    getPlaceById: builder.query<PlaceById, PlaceByIdQuery>({
      query: ({ id, sort }) => `/places/${id}?sort=${sort}`,
      providesTags: (_response, _error, { id }) => [
        "Session",
        { type: "Places", id },
      ],
    }),
    // ...
  }),
});
```

the code is slightly simplified. the `builder` merges the `baseQuery` with your endpoint definitions and generates the corresponding `useXQuery` and `useYMutation` hooks

unlike React Query, RTK Query automatically caches requests by endpoint and arguments, but you still need tags to invalidate that cache after a mutation

as you'll notice, tags are limited to 2 formats:

```ts
// type
type Tag = string | { type: string; id?: string | number };
```

yep, no arbitrary properties. i had to add separate tags like `{ type: "PlacesSort", id: sort }` to invalidate places based on sort or filter parameters. in React Query, you could simply invalidate a key like `{ type: "Places", filter: "voted-by-me" }` (adapted to RTK Query style). i understand, this makes it easier to create type-safe tags, but i wouldn't mind typing my custom optional keys

the real pain point is session management: when the server responds with a `401 Unauthorized` error, cached data is not cleared, which is expected. the problem is that there's _no way_ in RTK Query to update cached data based on a tag, you can only invalidate it. invalidation triggers a refetch, which result in another `401` error

the only workaround i found was to use a separate `sessionSlice` (shown earlier) to manage the user state. this means manually dispatching the `setSession` action alongside auth-related mutations:

```tsx
function Example() {
  const dispatch = useAppDispatch();

  const { data, error, isLoading } = useGetSessionQuery();
  const user = useAppSelector((state) => state.session.user);

  // this confusing piece of code was created by trial and error
  // it calls setSession when on initial load, when user their session is still valid
  // we don't want to call this when a user has logged out but
  // the cached data has not yet been updated
  // the more readable alternative would be to use a custom baseQuery to
  // automatically reset loggedOut on 401 Unauthorized error
  // refactoring this is in my to do list
  const [loggedOut, setLoggedOut] = useState(false);
  if (data && !user && !loggedOut) {
    dispatch(setSession(data));
  }

  const [logOut, logOutResult] = useLogOutMutation();

  return (
    <button
      onClick={async () => {
        try {
          await logOut();
        } catch {
          /* empty */
        }
        dispatch(setSession(null));

        setLoggedOut(true);
      }}
    >
      log out
    </button>
  );
}
```

yes, it's confusing. in React Query, a mutation or query is only unsuccessful if its function throws. my custom fetch wrapper was customized not to throw on `401`, allowing me to simply set the user to null in the `onSuccess` handler:

```ts
const { isPending, mutate } = useMutation({
  mutationFn: () => mutateApi("POST", "/log-out"),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["current-user"] });
    setUser(null);
  },
});
```

## conclusion

RTK Query is rather good than bad, but proper auth handling and tags are too confusing. React Query is far more straightforward in these areas

at the same time, RTK Query's structure makes it diffuclt to write messy code. when i started this project, i knew too little about clean architecture and often place query logic directly within components instead of abstracting it into custom hooks. RTK Query forces you to keep data-fetching logic separate (in React Query, the equivalent pattern would be to create your own custom hooks in a separate file) i'd argue that Redux also encourages a higher quality code

that said, i doubt i'd have learned what makes code clean by using a library that enforces it. on the contrary, i wouldn't have felt the pain of writing spaghetti code, which is what motivated me to learn about maintainable architecture. the best way to learn is by making mistakes and fixing them, so don't hesitate to start with a more flexible library like React Query

my conclusion: more flexible and straightforward libraries exists. it only seems to make sense to use RTK Query if you have junior developers who must be prevented from writing bad code on your team

nevertheless, RTK Query does have some other advantages over React Query:

- automatic caching based on query arguments (though tags are still needed for invalidation after mutations)
- typed tags
- less agressive defaults: no retries or refetching on window focus
- `mutate` functions are promises, allowing you to `await` and `try/catch` them instead of using `onSuccess` or `onError` callbacks. this can prevent common hook-related issues and leads to more intuitive code (though it makes optimistic and pessimistic query updates more confusing)

if these points are compelling, try it out. you might form a different opinion
