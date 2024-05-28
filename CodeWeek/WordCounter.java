import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import javax.sound.sampled.*;
import org.tensorflow.Graph;
import org.tensorflow.Graph;
import org.tensorflow.SavedModelBundle;
import org.tensorflow.Session;
import org.tensorflow.Session;
import org.tensorflow.Tensor;
import org.tensorflow.Tensor;
import org.tensorflow.Tensors;
import org.tensorflow.Tensors;
import org.tensorflow.framework.ConfigProto;
import org.tensorflow.framework.GPUOptions;
import org.tensorflow.framework.GraphDef;
import org.tensorflow.framework.MetaGraphDef;
import org.tensorflow.framework.NodeDef;
import org.tensorflow.util.SaverDef;

public class WordCounter {

  private static final int BUFFER_SIZE = 4096;
  private static final String MODEL_PATH = "path/to/your/model";

  public static void main(String[] args) {
    try {
      // Load the TensorFlow model
      byte[] graphDef = Files.readAllBytes(Paths.get(MODEL_PATH));
      Graph graph = new Graph();
      graph.importGraphDef(graphDef);

      // Set up audio capture
      AudioFormat format = new AudioFormat(16000, 16, 1, true, true);
      DataLine.Info info = new DataLine.Info(TargetDataLine.class, format);
      TargetDataLine microphone = (TargetDataLine) AudioSystem.getLine(info);
      microphone.open(format);
      microphone.start();

      ByteArrayOutputStream out = new ByteArrayOutputStream();
      byte[] buffer = new byte[BUFFER_SIZE];
      int wordCount = 0;

      System.out.println("Listening for the word...");

      while (true) {
        int bytesRead = microphone.read(buffer, 0, buffer.length);
        out.write(buffer, 0, bytesRead);

        // Process the audio data
        byte[] audioData = out.toByteArray();
        try (Tensor<Float> inputTensor = Tensors.create(audioData)) {
          try (Session session = new Session(graph)) {
            Tensor<?> result = session
              .runner()
              .feed("input", inputTensor)
              .fetch("output")
              .run()
              .get(0);
            float[] probabilities = result.copyTo(new float[1][1])[0];

            // Check if the word is recognized
            if (probabilities[0] > 0.5) { // Assuming a threshold of 0.5
              wordCount++;
              System.out.println("Word recognized! Count: " + wordCount);
            }
          }
        }

        out.reset();
      }
    } catch (LineUnavailableException | IOException e) {
      e.printStackTrace();
    }
  }
}
