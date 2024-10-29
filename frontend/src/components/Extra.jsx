import Container from "./Container"
import Markdown from "react-markdown"

const Extra = ({ extra }) => {
  const markdown = `
Enter a keyword for study materials: **Cybersecurity** **Network Attacks** **Phishing** **Malware** **Identity Theft**

Fetching study materials for keyword: **Cybersecurity** **Network Attacks** **Phishing** **Malware** **Identity Theft**  
----------------------------------------

### YouTube Videos:
1. [Phishing Attack](https://www.youtube.com/watch?v=gSQgbCo6PAg)
2. [Phishing Explained In 6 Minutes | What Is A Phishing Attack? | Phishing Attack | Simplilearn](https://www.youtube.com/watch?v=XBkzBrXlle0)
3. [Cybersecurity Expert Demonstrates How Hackers Easily Gain Access To Sensitive Information](https://www.youtube.com/watch?v=aP8yrkkLWlM)
4. [Funny Animation Video (Phishing Attack) | Pencil Animation | Short Animated Films](https://www.youtube.com/watch?v=sS3mZVCARZg)
5. [What is phishing? Learn how this attack works](https://www.youtube.com/watch?v=Y7zNlEMDmI4)

### Google Search Results:
1. [Know the types of cyber threats | Mass.gov](https://www.mass.gov/info-details/know-the-types-of-cyber-threats)  
   *Snippet*: Cyber criminals develop large networks of infected computers called Botnets by planting malware. A DDoS attack may not be the primary cyber crime. The attacks ...

2. [Avoiding Social Engineering and Phishing Attacks | CISA](https://www.cisa.gov/news-events/news/avoiding-social-engineering-and-phishing-attacks)  
   *Snippet*: Feb 1, 2021 ... Cybersecurity Best Practices, Cyber Threats and Advisories, Malware, Phishing, and Ransomware ... Watch for other signs of identity theft.

3. [Cybercrime — FBI](https://www.fbi.gov/investigate/cyber)  
   *Snippet*: Identity theft happens when someone steals your personal information, like your Social Security number, and uses it to commit theft or fraud. Ransomware is ...

4. [What is a Cyberattack? | IBM](https://www.ibm.com/topics/cyber-attack)  
   *Snippet*: ... identity theft or sell it on the dark web or hold it for ransom. Extortion is another tactic that is used. Hackers may use ransomware, DDoS attacks, or ...

5. [12 Most Common Types of Cyberattacks](https://www.crowdstrike.com/en-us/cybersecurity-101/cyberattacks/common-cyberattacks/)  
   *Snippet*: May 13, 2024 ... Malware · Denial-of-Service (DoS) Attacks · Phishing · Spoofing · Identity-Based Attacks · Code Injection Attacks · Supply Chain Attacks · Social ...

6. [What are Cyber Threats?](https://www.recordedfuture.com/threat-intelligence-101/cyber-threats)  
   *Snippet*: Aug 1, 2024 ... This article covers the different types of cyber threats including malware, ransomware, phishing ... computer system, ransomware, data ...

7. [Phishing | Federal Trade Commission](https://www.ftc.gov/business-guidance/small-businesses/cybersecurity/phishing)  
   *Snippet*: Identity Theft and Online Security · Scams · Business Guidance · Advertising and ... That way, if a phishing attack happens and hackers get to your network, you ...

8. [Internet Crime Complaint Center (IC3): Home Page](https://www.ic3.gov/)  
   *Snippet*: Combined with other data, it allows the FBI to investigate reported crimes, track trends and threats, and, in some cases, even freeze stolen funds. Just as ...

9. [What is cybersecurity? - Cisco](https://www.cisco.com/site/us/en/learn/topics/security/what-is-cybersecurity.html)  
   *Snippet*: Types of cybersecurity threats · Cloud security · Identity · Malware · Phishing · Ransomware · Social engineering · Threat detection · Zero trust.

10. [157 Cybersecurity Statistics and Trends [updated 2024]](https://www.varonis.com/blog/cybersecurity-statistics)  
   *Snippet*: Stats on IoT, DDoS, and other attacks · Use of stolen cards is the most common type of threat, followed by ransomware and phishing. · DDoS attacks have dominated ...

### Gemini Generated Content:
1. Gemini Content for Cybersecurity Network Attacks Phishing Malware Identity Theft  
   *Content*: Generated content based on Cybersecurity Network Attacks Phishing Malware Identity Theft.
`

  return (
    <Container>
      <div className="w-full h-full border-2 border-background rounded-md markdown-content p-4 overflow-y-auto scrollbar    ">
        <Markdown>{markdown}</Markdown>
      </div>
    </Container>
  )
}

export default Extra
