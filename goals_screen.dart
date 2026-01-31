
import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:confetti/confetti.dart';

// Hive Model
@HiveType(typeId: 3)
class Goal extends HiveObject {
  @HiveField(0)
  late String id;
  @HiveField(1)
  late String title;
  @HiveField(2)
  late String timeframe; // 'Monthly' or 'Yearly'
  @HiveField(3)
  late List<SubTask> tasks;
}

@HiveType(typeId: 4)
class SubTask extends HiveObject {
  @HiveField(0)
  late String text;
  @HiveField(1)
  late bool isCompleted;
}

class GoalsScreen extends StatefulWidget {
  const GoalsScreen({super.key});

  @override
  State<GoalsScreen> createState() => _GoalsScreenState();
}

class _GoalsScreenState extends State<GoalsScreen> {
  late ConfettiController _confettiController;
  final Box _goalsBox = Hive.box('goals');

  @override
  void initState() {
    super.initState();
    _confettiController = ConfettiController(duration: const Duration(seconds: 2));
  }

  void _onGoalCompleted() {
    _confettiController.play();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D1B2A),
      body: Stack(
        children: [
          ValueListenableBuilder(
            valueListenable: _goalsBox.listenable(),
            builder: (context, Box box, _) {
              final goals = box.values.toList();
              return ListView.builder(
                itemCount: goals.length,
                itemBuilder: (context, index) {
                  final goal = goals[index] as Goal;
                  return _buildGoalCard(goal);
                },
              );
            },
          ),
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirectionality: BlastDirectionality.explosive,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGoalCard(Goal goal) {
    // Implementation of the glassmorphism card with progress bar
    return Container(); 
  }
}
