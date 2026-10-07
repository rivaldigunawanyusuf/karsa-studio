// Template library - grouped by category. Each template has an id, name, category, icon and code.

export const TEMPLATE_CATEGORIES = [
  { id: 'flow', name: 'Flow & Process' },
  { id: 'data', name: 'Database & Structure' },
  { id: 'interaction', name: 'Interaction & System' },
  { id: 'planning', name: 'Planning & Time' },
  { id: 'charts', name: 'Charts & Data' },
  { id: 'ideas', name: 'Ideas & Others' },
];

export const TEMPLATES = [
  {
    id: 'flowchart',
    name: 'Flowchart',
    category: 'flow',
    icon: '◇',
    description: 'Process flow with decisions, subgraphs & styling',
    code: `---
title: E-Commerce Checkout Process
---
flowchart TD
    A([Start]) --> B[Shopping Cart]
    B --> C{Logged in?}
    C -- No --> D[Login Page]
    D --> E[(User Database)]
    E --> C
    C -- Yes --> F[Select Address]
    F --> G[Select Payment]

    subgraph Payment
        direction LR
        G --> H{Method}
        H -->|Transfer| I[Virtual Account]
        H -->|E-Wallet| J[QRIS]
        H -->|Card| K[Payment Gateway]
    end

    I & J & K --> L{Success?}
    L -- Yes --> M[/Send Invoice/]
    L -- No --> G
    M --> N([Finish])

    classDef start fill:#10b981,stroke:#047857,color:#fff
    classDef danger fill:#f43f5e,stroke:#be123c,color:#fff
    class A,N start
    class D danger
`,
  },
  {
    id: 'flowchart-lr',
    name: 'Architecture Flowchart',
    category: 'flow',
    icon: '⇄',
    description: 'Service architecture with clear layered boundaries',
    code: `flowchart LR
    Client((User)) --> CDN[CDN / WAF]
    CDN --> Gateway[API Gateway]

    subgraph Services [App Services]
        Gateway --> Auth{{Auth Service}}
        Gateway --> Order[Order Service]
        Gateway --> Payment[Payment Service]
    end

    subgraph Databases [Data Storage]
        Auth --> DBAuth[(User DB)]
        Order --> DBOrder[(Order DB)]
        Payment --> DBPay[(Payment DB)]
        Order --> Cache[(Redis Cache)]
    end

    Payment -.-> Queue>Message Queue]
    Queue -.-> Worker[[Worker Node]]

    classDef db fill:#047857,stroke:#064e3b,color:#fff
    classDef svc fill:#2563eb,stroke:#1e3a8a,color:#fff
    
    class DBAuth,DBOrder,DBPay,Cache db
    class Auth,Order,Payment svc
`,
  },
  {
    id: 'state',
    name: 'State Diagram',
    category: 'flow',
    icon: '◎',
    description: 'Status transitions (e.g. order status)',
    code: `stateDiagram-v2
    direction LR
    [*] --> Draft
    Draft --> Pending : submit
    Pending --> Paid : pay
    Pending --> Cancelled : timeout
    Paid --> Shipped : ship

    state Shipped {
        [*] --> InTransit
        InTransit --> Delivered
        Delivered --> [*]
    }

    Shipped --> Completed
    Completed --> [*]
    Cancelled --> [*]

    note right of Pending
        Waiting for payment
        max 24 hours
    end note
`,
  },
  {
    id: 'er',
    name: 'ER Diagram (Database)',
    category: 'data',
    icon: '⛁',
    description: 'Relational database schema with PK/FK',
    code: `---
title: E-Commerce Database Schema
---
erDiagram
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ ADDRESSES : "has"
    ORDERS ||--|{ ORDER_ITEMS : "contains"
    PRODUCTS ||--o{ ORDER_ITEMS : "ordered in"
    CATEGORIES ||--o{ PRODUCTS : "groups"
    ORDERS ||--o| PAYMENTS : "paid via"

    USERS {
        bigint id PK
        varchar email UK "unique"
        varchar password_hash
        varchar full_name
        timestamp created_at
    }
    ADDRESSES {
        bigint id PK
        bigint user_id FK
        text street
        varchar city
        varchar postal_code
    }
    ORDERS {
        bigint id PK
        bigint user_id FK
        bigint address_id FK
        decimal total_amount
        varchar status
        timestamp ordered_at
    }
    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        int quantity
        decimal unit_price
    }
    PRODUCTS {
        bigint id PK
        bigint category_id FK
        varchar sku UK
        varchar name
        decimal price
        int stock
    }
    CATEGORIES {
        bigint id PK
        varchar name
        bigint parent_id FK
    }
    PAYMENTS {
        bigint id PK
        bigint order_id FK
        varchar method
        decimal amount
        timestamp paid_at
    }
`,
  },
  {
    id: 'class',
    name: 'Class Diagram',
    category: 'data',
    icon: '▤',
    description: 'OOP class structure, interfaces & relations',
    code: `classDiagram
    direction TB
    class Repository~T~ {
        <<interface>>
        +findById(id) T
        +save(entity T) void
        +delete(id) void
    }
    class User {
        +String id
        +String email
        -String passwordHash
        +login(password) bool
        +logout() void
    }
    class Order {
        +String id
        +Date createdAt
        +OrderStatus status
        +total() Decimal
    }
    class OrderStatus {
        <<enumeration>>
        PENDING
        PAID
        SHIPPED
    }
    class UserRepository
    class OrderService {
        -Repository~Order~ repo
        +checkout(user, cart) Order
    }

    Repository <|.. UserRepository : implements
    User "1" --> "*" Order : places
    Order --> OrderStatus
    OrderService ..> Repository : uses
    OrderService o-- Order
`,
  },
  {
    id: 'requirement',
    name: 'Requirement Diagram',
    category: 'data',
    icon: '☑',
    description: 'System requirements & traceability',
    code: `requirementDiagram

    requirement login_req {
        id: 1
        text: User must be able to log in with email
        risk: high
        verifymethod: test
    }

    performanceRequirement response_time {
        id: 1.1
        text: Login response under 300ms
        risk: medium
        verifymethod: analysis
    }

    element auth_service {
        type: microservice
        docref: services/auth
    }

    auth_service - satisfies -> login_req
    response_time - derives -> login_req
`,
  },
  {
    id: 'packet',
    name: 'Packet Diagram',
    category: 'data',
    icon: '▦',
    description: 'Bit structure / network packet',
    code: `packet-beta
title TCP Header
0-15: "Source Port"
16-31: "Destination Port"
32-63: "Sequence Number"
64-95: "Acknowledgment Number"
96-99: "Data Offset"
100-105: "Reserved"
106-111: "Flags"
112-127: "Window"
128-143: "Checksum"
144-159: "Urgent Pointer"
`,
  },
  {
    id: 'sequence',
    name: 'Sequence Diagram',
    category: 'interaction',
    icon: '⇅',
    description: 'Inter-service interaction (login flow)',
    code: `sequenceDiagram
    autonumber
    actor U as User
    participant FE as Frontend
    participant API as API Gateway
    participant Auth as Auth Service
    participant DB as Database

    U->>FE: Fill email & password
    FE->>+API: POST /auth/login
    API->>+Auth: validate(credentials)
    Auth->>+DB: SELECT user WHERE email
    DB-->>-Auth: user row

    alt Password valid
        Auth-->>API: JWT token
        API-->>FE: 200 OK + token
        FE-->>U: Redirect to dashboard
    else Password invalid
        Auth-->>API: 401 Unauthorized
        API-->>FE: Error
        FE-->>U: Show error message
    end
    deactivate Auth
    deactivate API

    Note over FE,API: Token stored in httpOnly cookie
    loop Every 15 minutes
        FE->>API: Refresh token
    end
`,
  },
  {
    id: 'architecture',
    name: 'Architecture (Cloud)',
    category: 'interaction',
    icon: '☁',
    description: 'Cloud architecture diagram with groups & services',
    code: `architecture-beta
    group api(cloud)[API Layer]

    service gateway(internet)[Gateway] in api
    service server(server)[App Server] in api
    service db(database)[Database] in api
    service disk(disk)[Storage] in api
    service cache(server)[Cache] in api

    gateway:R --> L:server
    server:B --> T:db
    server:R --> L:cache
    db:R --> L:disk
`,
  },
  {
    id: 'c4',
    name: 'C4 Context',
    category: 'interaction',
    icon: '⬚',
    description: 'C4 model for system context',
    code: `C4Context
    title Internet Banking System Context

    Person(customer, "Customer", "Bank customer with personal accounts")
    
    System_Boundary(b0, "Bank System") {
        System(banking, "Internet Banking", "Allows customers to view balances & transfer funds")
    }

    System_Ext(mail, "Email System", "Internal email system")
    System_Ext(core, "Core Banking", "Stores account & transaction data")

    Rel(customer, banking, "Uses", "HTTPS")
    Rel(banking, mail, "Sends emails via", "SMTP")
    Rel(banking, core, "Fetches data via", "JSON/HTTPS")
    Rel(mail, customer, "Sends notifications to")
    
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
`,
  },
  {
    id: 'block',
    name: 'Block Diagram',
    category: 'interaction',
    icon: '▣',
    description: 'Freeform block layout with columns',
    code: `block-beta
    columns 3
    frontend["Frontend"]:3
    space down1<[" "]>(down) space
    api["API"] auth["Auth"] queue["Queue"]
    space down2<[" "]>(down) space
    db[("Database")]:3

    style frontend fill:#6366f1,color:#fff
    style db fill:#10b981,color:#fff
`,
  },
  {
    id: 'gantt',
    name: 'Gantt Chart',
    category: 'planning',
    icon: '▬',
    description: 'Project schedule & milestones',
    code: `gantt
    title App Development Roadmap
    dateFormat YYYY-MM-DD
    axisFormat %d %b
    excludes weekends

    section Planning
        Requirements gathering :done, req, 2026-01-05, 7d
        UI/UX Design          :done, ui, after req, 10d

    section Development
        Infrastructure setup  :active, infra, after ui, 5d
        Backend API           :crit, be, after infra, 20d
        Frontend              :fe, after infra, 18d

    section Release
        QA & Testing          :qa, after be, 7d
        Go Live               :milestone, golive, after qa, 0d
`,
  },
  {
    id: 'timeline',
    name: 'Timeline',
    category: 'planning',
    icon: '⟿',
    description: 'Event timeline / product history',
    code: `timeline
    title Startup Journey
    section Early Stage
        2023 : Idea & Validation
             : Core team formed
        2024 : MVP Launched
             : First 1,000 users
    section Growth
        2025 : Seed funding
             : Expansion to 5 cities
        2026 : Series A
             : 1 million users
`,
  },
  {
    id: 'journey',
    name: 'User Journey',
    category: 'planning',
    icon: '☺',
    description: 'User experience per stage',
    code: `journey
    title Online Shopping Experience
    section Finding products
        Open app: 5: Customer
        Search product: 3: Customer
        Read reviews: 4: Customer
    section Checkout
        Add to cart: 5: Customer
        Fill address: 2: Customer
        Pay: 3: Customer, Payment
    section Delivery
        Track package: 4: Customer, Courier
        Receive item: 5: Customer
`,
  },
  {
    id: 'kanban',
    name: 'Kanban Board',
    category: 'planning',
    icon: '▥',
    description: 'Task board with status columns',
    code: `kanban
    todo[Todo]
        t1[Design login page]
        t2[Setup CI/CD]@{ priority: 'High' }
    progress[In Progress]
        t3[Auth API]@{ assigned: 'Rivaldi', priority: 'Very High' }
    review[Review]
        t4[Order service unit tests]
    done[Done]
        t5[Setup repository]
`,
  },
  {
    id: 'gitgraph',
    name: 'Git Graph',
    category: 'planning',
    icon: '⑂',
    description: 'Git branch & merge flow',
    code: `gitGraph
    commit id: "init"
    commit id: "setup"
    branch develop
    checkout develop
    commit id: "feat: auth"
    branch feature/payment
    checkout feature/payment
    commit id: "feat: midtrans"
    commit id: "fix: callback"
    checkout develop
    merge feature/payment
    checkout main
    merge develop tag: "v1.0.0"
    commit id: "hotfix"
`,
  },
  {
    id: 'pie',
    name: 'Pie Chart',
    category: 'charts',
    icon: '◔',
    description: 'Proportional distribution',
    code: `pie showData
    title Website Traffic Sources
    "Organic Search" : 42.5
    "Social Media" : 24
    "Direct" : 18.3
    "Referral" : 9.2
    "Email" : 6
`,
  },
  {
    id: 'xychart',
    name: 'XY Chart (Bar & Line)',
    category: 'charts',
    icon: '▁▃▆',
    description: 'Bar & line graphs',
    code: `xychart-beta
    title "Monthly Revenue 2026 (Thousands USD)"
    x-axis [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]
    y-axis "Revenue" 0 --> 500
    bar [120, 150, 180, 210, 230, 260, 300, 320, 350, 390, 420, 480]
    line [100, 140, 170, 200, 220, 250, 280, 310, 340, 370, 410, 460]
`,
  },
  {
    id: 'quadrant',
    name: 'Quadrant Chart',
    category: 'charts',
    icon: '⊞',
    description: '2x2 priority matrix',
    code: `quadrantChart
    title Feature Prioritization
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Plan
    quadrant-2 Do Now
    quadrant-3 Drop
    quadrant-4 Delegate
    Dark mode: [0.2, 0.55]
    Export PDF: [0.45, 0.8]
    SSO Login: [0.75, 0.9]
    Animations: [0.3, 0.2]
    Multi-language: [0.8, 0.35]
`,
  },
  {
    id: 'sankey',
    name: 'Sankey',
    category: 'charts',
    icon: '≋',
    description: 'Value flow between nodes',
    code: `sankey-beta

Income,Salary,60
Income,Investments,25
Income,Freelance,15
Salary,Needs,35
Salary,Savings,15
Salary,Entertainment,10
Investments,Savings,25
Freelance,Needs,5
Freelance,Entertainment,10
`,
  },
  {
    id: 'radar',
    name: 'Radar Chart',
    category: 'charts',
    icon: '✶',
    description: 'Multi-dimensional comparison',
    code: `radar-beta
    title Framework Comparison
    axis perf["Performance"], dx["DX"], eco["Ecosystem"], learn["Learning"], ssr["SSR"]
    curve react["React"]{80, 85, 95, 70, 85}
    curve vue["Vue"]{85, 90, 80, 90, 80}
    curve svelte["Svelte"]{95, 90, 60, 85, 80}
    max 100
    min 0
`,
  },
  {
    id: 'treemap',
    name: 'Treemap',
    category: 'charts',
    icon: '▩',
    description: 'Proportional hierarchy',
    code: `treemap-beta
"Budget"
    "Engineering"
        "Backend": 40
        "Frontend": 30
        "DevOps": 15
    "Marketing"
        "Ads": 25
        "Content": 10
    "Operations": 20
`,
  },
  {
    id: 'mindmap',
    name: 'Mindmap',
    category: 'ideas',
    icon: '✺',
    description: 'Hierarchical mind map',
    code: `mindmap
  root((Mobile App))
    Features
      Authentication
        OTP Login
        Google SSO
      Payments
        QR Code
        Virtual Account
      Notifications
    Technology
      Flutter
      Firebase
      Node.js API
    Team
      Product Manager
      Developer
      Designer
`,
  },
  {
    id: 'blank',
    name: 'Blank',
    category: 'ideas',
    icon: '＋',
    description: 'Start from a blank flowchart',
    code: `flowchart TD
    A[Start] --> B[Next step]
`,
  },
];

export const DEFAULT_CODE = TEMPLATES[0].code;

export function getTemplate(id) {
  return TEMPLATES.find((t) => t.id === id);
}
