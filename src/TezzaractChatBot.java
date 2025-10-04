import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.CodeSource;
import java.util.*;

public class TezzaractChatBot extends JFrame implements ActionListener {

    // UI
    private JTextField inputField;
    private JButton sendButton;
    private JPanel chatPanel;
    private JScrollPane scrollPane;

    // Memory
    private Map<String, String> faq;

    // Theme
    private static final Color BG = Color.BLACK;
    private static final Color GOLD = new Color(255, 215, 0);
    private static final Color BUBBLE_DARK = new Color(40, 40, 40);
    private static final Color BORDER_DARK = new Color(60, 60, 60);

    public TezzaractChatBot() {
        setTitle("Tezzaract - VSB Student Assistant");
        setSize(900, 800);
        setMinimumSize(new Dimension(700, 600));
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        getContentPane().setBackground(BG);

        // Load memory
        faq = loadMemory(resolveMemoryPath());

        // ===== HEADER (centered) =====
        JPanel header = new JPanel(new GridLayout(2, 1));
        header.setBackground(BG);
        header.setBorder(new EmptyBorder(20, 10, 10, 10));

        JLabel title = new JLabel("Tezzaract", JLabel.CENTER);
        title.setFont(pickFont(Font.BOLD, 34));
        title.setForeground(GOLD);

        JLabel subtitle = new JLabel("VSB Student Assistant", JLabel.CENTER);
        subtitle.setFont(pickFont(Font.PLAIN, 16));
        subtitle.setForeground(new Color(180, 180, 180));

        header.add(title);
        header.add(subtitle);
        add(header, BorderLayout.NORTH);

        // ===== CENTER (greeting banner + chat scroll) =====
        JPanel center = new JPanel(new BorderLayout());
        center.setBackground(BG);

        JPanel greeting = new JPanel();
        greeting.setBackground(new Color(28, 28, 28));
        greeting.setBorder(new EmptyBorder(12, 16, 12, 16));
        JLabel greetText = new JLabel("💡 Ask me anything about VSB College");
        greetText.setFont(pickFont(Font.PLAIN, 15));
        greetText.setForeground(GOLD);
        greeting.add(greetText);
        center.add(greeting, BorderLayout.NORTH);

        chatPanel = new JPanel();
        chatPanel.setLayout(new BoxLayout(chatPanel, BoxLayout.Y_AXIS));
        chatPanel.setBackground(BG);

        scrollPane = new JScrollPane(chatPanel);
        scrollPane.setBorder(null);
        scrollPane.setBackground(BG);
        scrollPane.getVerticalScrollBar().setUnitIncrement(18);
        center.add(scrollPane, BorderLayout.CENTER);

        add(center, BorderLayout.CENTER);

        // ===== INPUT BAR =====
        JPanel inputBar = new JPanel(new BorderLayout(10, 10));
        inputBar.setBorder(new EmptyBorder(14, 18, 18, 18));
        inputBar.setBackground(BG);

        inputField = new JTextField();
        inputField.setFont(pickFont(Font.PLAIN, 16));
        inputField.setBackground(BG);
        inputField.setForeground(Color.WHITE);
        inputField.setCaretColor(Color.WHITE);
        inputField.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(GOLD, 2, true),
                new EmptyBorder(12, 14, 12, 14)
        ));

        sendButton = new JButton("Send");
        sendButton.setFont(pickFont(Font.BOLD, 16));
        sendButton.setBackground(GOLD);
        sendButton.setForeground(Color.BLACK);
        sendButton.setFocusPainted(false);
        sendButton.setBorder(new EmptyBorder(12, 22, 12, 22));
        sendButton.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));

        inputBar.add(inputField, BorderLayout.CENTER);
        inputBar.add(sendButton, BorderLayout.EAST);
        add(inputBar, BorderLayout.SOUTH);

        // Actions
        sendButton.addActionListener(this);
        inputField.addActionListener(this);

        // Welcome
        addMessage(false, "👋 Welcome to VSB Engineering College!\nI’m Tezzaract, your student assistant.\nAsk me anything about admissions, courses, or campus life.");
    }

    // ===== Memory loader (UTF-8) with jar/dir fallback =====
    // ===== Memory loader (supports multiline values) =====
private Map<String, String> loadMemory(String path) {
    Map<String, String> map = new LinkedHashMap<>();
    try (BufferedReader br = new BufferedReader(
            new InputStreamReader(new FileInputStream(path), StandardCharsets.UTF_8))) {

        String line;
        String currentKey = null;
        StringBuilder currentValue = new StringBuilder();

        while ((line = br.readLine()) != null) {
            if (line.contains("=") && !line.startsWith(" ")) {
                // Save previous entry
                if (currentKey != null) {
                    map.put(currentKey, currentValue.toString().trim());
                }
                // Start new entry
                String[] parts = line.split("=", 2);
                currentKey = parts[0].trim().toLowerCase();
                currentValue = new StringBuilder(parts.length > 1 ? parts[1].trim() : "");
            } else {
                // Continuation of previous value
                if (currentKey != null) {
                    currentValue.append("\n").append(line.trim());
                }
            }
        }
        // Save last entry
        if (currentKey != null) {
            map.put(currentKey, currentValue.toString().trim());
        }

    } catch (Exception e) {
        e.printStackTrace();
        JOptionPane.showMessageDialog(this,
                "⚠ Could not load memory file: " + path + "\n" + e.getMessage(),
                "Memory Error", JOptionPane.ERROR_MESSAGE);
    }
    return map;
}


    // Try working dir first; else jar folder
    private String resolveMemoryPath() {
        File f1 = new File("memory.txt");
        if (f1.exists()) return f1.getAbsolutePath();
        try {
            CodeSource cs = TezzaractChatBot.class.getProtectionDomain().getCodeSource();
            if (cs != null) {
                File jar = new File(cs.getLocation().toURI());
                File sibling = new File(jar.getParentFile(), "memory.txt");
                if (sibling.exists()) return sibling.getAbsolutePath();
            }
        } catch (Exception ignored) {}
        return "memory.txt"; // fallback
    }

    // ===== Add one message (bubble) =====
    private void addMessage(boolean isUser, String text) {
        // Outer line stretches FULL width; bubble aligns left/right inside it
        JPanel line = new JPanel(new BorderLayout());
        line.setOpaque(false);
        line.setBorder(new EmptyBorder(6, 10, 6, 10));
        line.setMaximumSize(new Dimension(Integer.MAX_VALUE, Integer.MAX_VALUE));

        // Flow wrapper to align bubble left/right without shrinking full width
        JPanel flow = new JPanel(new FlowLayout(isUser ? FlowLayout.RIGHT : FlowLayout.LEFT, 0, 0));
        flow.setOpaque(false);

        JPanel bubble = createBubble(text, isUser);
        flow.add(bubble);

        line.add(flow, BorderLayout.CENTER);
        chatPanel.add(line);
        chatPanel.revalidate();

        SwingUtilities.invokeLater(() -> {
            JScrollBar v = scrollPane.getVerticalScrollBar();
            v.setValue(v.getMaximum());
        });
    }

    // Rounded bubble with shadow + width cap
    private JPanel createBubble(String message, boolean isUser) {
        // width cap for readable lines
        int maxBubbleWidth = 560;

        JLabel lbl = new JLabel(toHtmlWrapped(message, maxBubbleWidth));
        lbl.setFont(pickEmojiFont(15)); // better emoji support
        lbl.setForeground(isUser ? Color.BLACK : Color.WHITE);
        lbl.setOpaque(false);

        JPanel bubble = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                int arc = 22;
                int pad = 4;

                // Shadow
                g2.setColor(new Color(0, 0, 0, 70));
                g2.fillRoundRect(8, 8, getWidth() - 16, getHeight() - 16, arc, arc);

                // Bubble
                g2.setColor(isUser ? GOLD : BUBBLE_DARK);
                g2.fillRoundRect(pad, pad, getWidth() - pad * 2, getHeight() - pad * 2, arc, arc);

                // Border
                g2.setColor(isUser ? new Color(210, 175, 0) : BORDER_DARK);
                g2.setStroke(new BasicStroke(1.2f));
                g2.drawRoundRect(pad, pad, getWidth() - pad * 2, getHeight() - pad * 2, arc, arc);

                g2.dispose();
            }
        };
        bubble.setLayout(new BorderLayout());
        bubble.setOpaque(false);
        bubble.setBorder(new EmptyBorder(14, 18, 14, 18));
        bubble.add(lbl, BorderLayout.CENTER);

        // Preferred width based on label width cap
        Dimension pref = lbl.getPreferredSize();
        int targetW = Math.min(pref.width + 36, maxBubbleWidth + 36); // +padding
        bubble.setMaximumSize(new Dimension(targetW, Integer.MAX_VALUE));

        return bubble;
    }

    // Emojis + newlines 
    private static String toHtmlWrapped(String text, int widthPx) {
        // Escape only HTML-sensitive chars
        String esc = text.replace("&", "&amp;")
                         .replace("<", "&lt;")
                         .replace(">", "&gt;");

        // Convert \n to <br> for line breaks
        esc = esc.replace("\n", "<br>");

        return "<html><body style='width:" + widthPx + "px; margin:0;'>" + esc + "</body></html>";
    }

    // ===== Handle input =====
    @Override
    public void actionPerformed(ActionEvent e) {
        String user = inputField.getText().trim();
        if (user.isEmpty()) return;

        addMessage(true, user);
        inputField.setText("");

        new Thread(() -> {
            try { Thread.sleep(420); } catch (InterruptedException ignored) {}
            String reply = getResponse(user.toLowerCase(Locale.ROOT));
            SwingUtilities.invokeLater(() -> addMessage(false, reply));
        }).start();
    }

    // ===== Rule-based response from memory =====
    private String getResponse(String input) {
        for (String key : faq.keySet()) {
            if (input.contains(key)) return faq.get(key);
        }
        return "🤔 Sorry, I don’t have an answer for that yet.\nTry asking me something about VSB College.";
    }

    // Fonts 
    private static Font pickFont(int style, int size) {
        String[] candidates = {"Segoe UI", "Inter", "Roboto", "Arial", "SansSerif"};
        for (String name : candidates) {
            Font f = new Font(name, style, size);
            if (f.getFamily().equals(name)) return f;
        }
        return new Font(Font.SANS_SERIF, style, size);
    }

    private static Font pickEmojiFont(int size) {
        // Segoe UI Emoji
        Font f = new Font("Segoe UI Emoji", Font.PLAIN, size);
        if (f.getFamily().equals("Segoe UI Emoji")) return f;
        return pickFont(Font.PLAIN, size);
    }

    public static void main(String[] args) {
        // Native look 
        try { UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName()); } catch (Exception ignored) {}
        SwingUtilities.invokeLater(() -> new TezzaractChatBot().setVisible(true));
    }
}

