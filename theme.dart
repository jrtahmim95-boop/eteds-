
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:confetti/confetti.dart';

class AloTheme {
  // Colors
  static const Color spaceDark = Color(0xFF0D1B2A);
  static const Color cyanElectric = Color(0xFF00C4FF);
  static const Color whiteGlass = Color(0x14FFFFFF);

  static final ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: spaceDark,
    fontFamily: 'SF Pro Display', // Use local asset if available
    colorScheme: ColorScheme.fromSeed(
      seedColor: cyanElectric,
      primary: cyanElectric,
      secondary: Colors.white,
      brightness: Brightness.dark,
    ),
    cardTheme: CardTheme(
      color: whiteGlass,
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
    ),
  );

  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: const Color(0xFFF2F2F7),
    fontFamily: 'SF Pro Display',
    colorScheme: ColorScheme.fromSeed(
      seedColor: cyanElectric,
      primary: cyanElectric,
      brightness: Brightness.light,
    ),
  );
}

// Reusable Glassmorphism Widget
class GlassBox extends StatelessWidget {
  final Widget child;
  final double blur;
  final double opacity;
  final double borderRadius;

  const GlassBox({
    super.key,
    required this.child,
    this.blur = 20.0,
    this.opacity = 0.08,
    this.borderRadius = 24.0,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(opacity),
            borderRadius: BorderRadius.circular(borderRadius),
            border: Border.all(color: Colors.white.withOpacity(0.12)),
          ),
          child: child,
        ),
      ),
    );
  }
}

// 60FPS Pulsing Mic Button
class AnimatedMicButton extends StatelessWidget {
  final VoidCallback onTap;

  const AnimatedMicButton({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 72,
        height: 72,
        decoration: const BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
        ),
        child: const Icon(Icons.mic, color: Colors.black, size: 32),
      )
          .animate(onPlay: (controller) => controller.repeat(reverse: true))
          .scale(
            begin: const Offset(1, 1),
            end: const Offset(1.1, 1.1),
            duration: 1500.ms,
            curve: Curves.easeInOut,
          )
          .boxShadow(
            begin: const BoxShadow(color: Colors.transparent, blurRadius: 0),
            end: const BoxShadow(color: Color(0x4D00C4FF), blurRadius: 30),
            duration: 1500.ms,
          ),
    );
  }
}

// Dynamic Background Waves
class WaveBackground extends StatelessWidget {
  const WaveBackground({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned.fill(
          child: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [AloTheme.spaceDark, Color(0xFF001D3D)],
              ),
            ),
          ),
        ),
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: CustomPaint(
            size: Size(MediaQuery.of(context).size.width, 200),
            painter: WavePainter(),
          ).animate(onPlay: (c) => c.repeat()).shimmer(duration: 5.seconds),
        ),
      ],
    );
  }
}

class WavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AloTheme.cyanElectric.withOpacity(0.1)
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(0, size.height * 0.5)
      ..quadraticBezierTo(size.width * 0.25, size.height * 0.3, size.width * 0.5, size.height * 0.5)
      ..quadraticBezierTo(size.width * 0.75, size.height * 0.7, size.width, size.height * 0.5)
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}

// Success Confetti Wrapper
class SuccessConfetti extends StatefulWidget {
  final Widget child;
  final ConfettiController controller;

  const SuccessConfetti({super.key, required this.child, required this.controller});

  @override
  State<SuccessConfetti> createState() => _SuccessConfettiState();
}

class _SuccessConfettiState extends State<SuccessConfetti> {
  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        widget.child,
        ConfettiWidget(
          confettiController: widget.controller,
          blastDirectionality: BlastDirectionality.explosive,
          colors: const [AloTheme.cyanElectric, Colors.white, Colors.blue],
          shouldLoop: false,
        ),
      ],
    );
  }
}
