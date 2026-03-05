src/
├── app/
│   ├── globals.css          ← tokens CSS + dark mode class-based + skip-to-content
│   └── layout.tsx           ← ThemeProvider wrappant toute l'app
│
├── providers/
│   └── ThemeProvider.tsx    ← light/dark/system, localStorage, toggle
│
├── lib/
│   └── cn.ts                ← clsx + tailwind-merge utility
│
├── types/
│   ├── index.ts             ← types génériques (ID, PaginatedResponse, AsyncState…)
│   ├── story.ts             ← Story, StoryChapter, StoryAuthor, StoryGenre…
│   └── user.ts              ← User, AuthCredentials, RegisterPayload, AuthSession…
│
├── styles/
│   └── tokens.ts            ← design tokens (colors, spacing, fontSize, shadows…)
│
└── components/
    ├── atoms/               Button · Input · Textarea · Label · IconButton
    │                        Avatar · Badge · Card · Divider · Typography · Spinner
    ├── molecules/           SearchBar · StoryCard · UserInfoRow · FormField · NavigationItem
    ├── organisms/           Header · Sidebar · StoryList · StoryGrid · AuthForm
    ├── templates/           DashboardTemplate · FeedTemplate · AuthTemplate · StoryReaderTemplate
    └── layouts/             MainLayout