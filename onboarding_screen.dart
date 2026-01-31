
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:hive_flutter/hive_flutter.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  String _selectedRole = '';

  void _onRoleSelected(String role) async {
    setState(() => _selectedRole = role);
    var box = Hive.box('settings');
    await box.put('role', role);
    await box.put('isOnboarded', true);
    
    // Smooth transition to next step
    _pageController.nextPage(
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeOutCubic,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0D1B2A),
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          _buildLoginStep(),
          _buildQuizStep(),
          _buildFinalStep(),
        ],
      ),
    );
  }

  Widget _buildLoginStep() {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text("Join Alo", style: TextStyle(fontSize: 36, fontWeight: FontWeight.w900, color: Colors.white)),
          const SizedBox(height: 12),
          const Text("Create your secure account", style: TextStyle(color: Colors.white60, fontSize: 16)),
          const SizedBox(height: 48),
          _socialButton("Google", FontAwesomeIcons.google, Colors.white, Colors.black, "https://google.com"),
          _socialButton("Facebook", FontAwesomeIcons.facebook, const Color(0xFF1877F2), Colors.white, "https://facebook.com"),
          _socialButton("Phone", Icons.phone, Colors.emerald, Colors.white, "phone"),
        ],
      ).animate().fadeIn().slideY(begin: 0.1),
    );
  }

  Widget _buildQuizStep() {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Identify Yourself", style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 8),
          const Text("Which best describes you?", style: TextStyle(color: Colors.white54)),
          const SizedBox(height: 32),
          _roleCard("Student", Icons.school, "Focus on studies and growth."),
          _roleCard("Businessman", Icons.business_center, "Track wins and finances."),
          _roleCard("Housewife", Icons.home, "Manage home and wellness."),
        ],
      ),
    ).animate().fadeIn().slideX(begin: 0.1);
  }

  Widget _roleCard(String title, IconData icon, String subtitle) {
    return GestureDetector(
      onTap: () => _onRoleSelected(title),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: Colors.white.withOpacity(0.1)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
              child: Icon(icon, size: 28, color: Colors.blue),
            ),
            const SizedBox(width: 20),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                  Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.white38)),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: Colors.white24),
          ],
        ),
      ),
    );
  }

  Widget _socialButton(String label, IconData icon, Color bgColor, Color textColor, String type) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () => _pageController.nextPage(duration: 500.ms, curve: Curves.ease),
        icon: Icon(icon, size: 20, color: textColor),
        label: Text("Continue with $label", style: TextStyle(color: textColor, fontWeight: FontWeight.bold)),
        style: ElevatedButton.styleFrom(
          backgroundColor: bgColor,
          padding: const EdgeInsets.all(20),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          elevation: 0,
        ),
      ),
    );
  }

  Widget _buildFinalStep() => const Center(child: CircularProgressIndicator());
}
