
# Alo - Flutter Project Blueprint

## Folder Structure
```text
alo_app/
├── lib/
│   ├── main.dart               # Entry point
│   ├── models/                 # LogEntry, UserProfile, VaultItem, PlannerTask, Goal, SubTask
│   ├── providers/              # GeminiProvider, AuthProvider, VaultProvider, PlannerProvider, GoalProvider
│   ├── screens/                
│   │   ├── onboarding.dart
│   │   ├── dashboard.dart
│   │   ├── reports.dart        
│   │   ├── studio.dart
│   │   ├── vault.dart          
│   │   ├── planner.dart
│   │   └── goals.dart          # New: Yearly/Monthly Targets + Checklists
│   ├── widgets/                # GlassCard, VoiceOrb, TaskItem, ProgressRing
│   └── services/               # AuthService, GeminiService, StorageService (Hive), NotificationService
├── assets/
│   ├── fonts/                  # Inter
│   └── images/                 # App Icon
└── pubspec.yaml                # Dependencies
```

## Core Dependencies
```yaml
dependencies:
  firebase_core: ^latest
  firebase_auth: ^latest
  google_sign_in: ^latest
  hive_flutter: ^latest            # Core for offline storage
  hive: ^latest                    # Adapter system
  flutter_riverpod: ^latest
  flutter_animate: ^latest
  confetti: ^latest
  fl_chart: ^latest       
  share_plus: ^latest     
  url_launcher: ^latest   
  flutter_secure_storage: ^latest  
  local_auth: ^latest              
  flutter_local_notifications: ^latest 
  timezone: ^latest                    

dev_dependencies:
  hive_generator: ^latest          # For generating TypeAdapters
  build_runner: ^latest            # Required for code generation
```
