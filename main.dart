
import 'package:flutter/material.dart';

void main() {
  runApp(const AloApp());
}

class AloApp extends StatelessWidget {
  const AloApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Alo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        fontFamily: 'Inter',
        scaffoldBackgroundColor: const Color(0xFF0D1B2A),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF00C4FF),
          primary: const Color(0xFF00C4FF),
          secondary: Colors.white,
        ),
      ),
      home: const AloSplashScreen(),
    );
  }
}

class AloSplashScreen extends StatelessWidget {
  const AloSplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF0D1B2A), Color(0xFF00C4FF)],
          ),
        ),
        child: const Center(
          child: Text(
            'Alo',
            style: TextStyle(
              fontSize: 48,
              fontWeight: FontWeight.w900,
              letterSpacing: -2,
            ),
          ),
        ),
      ),
    );
  }
}
