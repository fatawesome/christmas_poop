# NCS Project Report

**Team members**: Ilya Alonov, Daria Vaskovskaya, Leonid Lygin.

## Vulnerabilities included

1.  https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-7614
    Package [npm-programmatic](https://www.npmjs.com/package/npm-programmatic)
    allows to execute npm commands from JS environment. Unfortunately, package
    is vulnerable to command injection due to the absence of input validation. 

    **CWE: Improper Neutralization of Input During Web Page Generation (79)**

2.  https://www.cvedetails.com/cve/CVE-2019-10744/
    Prototype polution in popular js libarary Lodash. The function defaultsDeep
    could be tricked into adding or modifying properties of Object.prototype
    using a constructor payload. 

    **CWE: Improper Input Validation (20)**

3.  https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-8135
    The uppy npm package &lt; 1.9.3 is vulnerable to a Server-Side Request
    Forgery (SSRF) vulnerability, which allows an attacker to scan local or
    external network or otherwise interact with internal systems. 

    **CWE: SSRF (918)**

4.  https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-14287
    Old `sudo` (up to 1.8.28) has some overflow problems, which lead to curcumvention of target user restrictions.
    If a rule in `/etc/sudoers` allows execution of a specific program under
    "anyone except root" (`!root`), then the user can execute that program under
    root, using a special user id.

    **CWE: Privilege issues (265)**

5.  https://cve.mitre.org/cgi-bin/cvename.cgi?name=cve-2014-6271
    Ol' good shellshock for bash.  A bug in processing of environment variables
    passed from the parent process results in arbitrary code execution.
    This can be used to gain unrestricted access to the system from an otherwise
    restricted interaction (e.g. a network request).

    **CWE: Data representation issues (137)**

6.  https://www.cvedetails.com/cve/CVE-2014-0160/
    Again, a famous vulnerability -- heartbleed.  A bug in bound-checking of
    OpenSSL heartbeat messages results in reading private memory from the remote
    machine.

    **CWE: Improper Restriction of Operations within the Bounds of a Memory
    Buffer (119)**

## Environment preparation

All environments are packaged inside docker, and can be located with these
links:

*   https://hub.docker.com/repository/docker/ionagamed/ncs-final-heartbleed
*   https://hub.docker.com/repository/docker/ionagamed/ncs-final-lodas
*   https://hub.docker.com/repository/docker/ionagamed/ncs-final-shellshock
*   https://hub.docker.com/repository/docker/ionagamed/ncs-final-sudo_lpe
*   https://hub.docker.com/repository/docker/ionagamed/ncs-final-uppy_backend
*   https://hub.docker.com/repository/docker/ionagamed/ncs-final-uppy_frontend
*   https://hub.docker.com/repository/docker/ionagamed/ncs-final-npm-programatic

Instructions on how to run them are bundled with this report in a form of a
`docker-compose` file.

## Exploit steps

1.  Heartbleed

    Generally, heartbleed is a very simple exploit.  An error in a bound
    condition resulted in heartbeat messages being returned from the server
    with a potential leak of data.

    A general schematic that is very illustrative proceeds as follows:

    > - Hey server, are you alive? If you are, respond 'hat', 3 letters.
    > - Hey client, yes I indeed am alive! 'hat', 3 letters.
    > - Hey server, are you alive? If you are, respond 'hat', 65535 letters.
    > - Hey client, yes I indeed am alive! 'hat <private data>', 65535 letters.

    The implemented defense for this is very simple, just check that the
    supplied string is actually of the length that the client had sent.

2.  Lodas
    
    Prototype Pollution refers to the ability to inject properties into
    existing JavaScript language construct prototypes, such as Objects. 
    When that happens, this leads to either denial of service by triggering 
    JavaScript exceptions, or it tampers with the application source code to force the 
    code path that the attacker injects, thereby leading to remote code execution.
    There are two main ways in which the pollution of prototypes occurs:
    * Unsafe Object recursive merge
    * Property definition by path
    
    A general way to exploit vulnerable `lodash.merge({}, data)` is to
    pass data, which contains `__proto__` field. 
    
    The implemented fix for this issue is just catching the edge cases:
    ```
    if (key == '__proto__') {
        return;
    }
    ``` 

3.  Shellshock

    Another famous vulnerability.  An missing check in parsing command line
    options resulted in `bash` importing straight-up functions from environment
    variables.  `bash` is very weird overall, so these kinds of bugs are to be
    expected.  Anyway, exploitation consists of somehow setting external
    environment variables before some `bash` process on the remote system would
    start.  This can be implemented using CGI, DHCP, mail agents, but we have
    chosen SSH.

    This vulnerability actually required two fixes, which both sanitized the
    external environment to implement that.

4.  Sudo LPE

    Sudo, a popular privilege-management tool, relatively recently had a bug,
    where if a user was allowed to run some command as "anybody, except ...",
    then that user would also be allowed to run that command as root.

    This happens due to the kernel treating user id -1 as a special case: it
    actually means _don't change the user id_, while sudo treats it as usual.

    Exploit is extremely simple:

    ```
    $ sudo -u#-1 <command>
    ```

    Fixing that included a basic `if` on this statement.

5.  Uppy
    
    Server Side Request Forgery allows hacker to extract inside information 
    from the server or to take control of internal services.
     
    Usually SSRF is exploited by finding some functionality which can make 
    requests from the servers name, then finding some way (usually, API) to 
    use this functionality and passing some malicious parameters to it (links, usually).     

    Fixing this vulnerability includes checking given URL against black-listed URLs and IPs:
    ```
    const validateURL = (url, debug) => {
      const validURLOpts = {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_tld: !debug
      }
      if (!validator.isURL(url, validURLOpts)) {
        return false
      }
    
      return true
    }
    ```
    ```
    agentClass: getProtectedHttpAgent(utils.parseURL(url).protocol, blockLocalIPs)
    ```

6.  NPM Programatic

## Difficulties faced

Researching vulnerabilities specifically in the source code was not something
that we are used to - especially the part where we researched the fixes for it.

## Conclusion

This was a novel experience, we have discovered new vulnerabilities, revisited
old ones and looked at them from a new point of view.  Actually digging in the
source code, commits, and forum messages was refreshing.
